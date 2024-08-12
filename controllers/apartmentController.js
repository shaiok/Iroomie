// const Apartment = require("../models/apartmentModel");
// const Roommate = require("../models/roommateModel");
// const calculateCompatibilityScore = require("../utils/matchingAlgorithm");

// exports.getApartment = async (req, res) => {
//   try {
//     const { apartmentId } = req.params;
//     const apartment = await Apartment.findById(apartmentId).populate(
//       "existimgRoommates"
//     );
//     if (!apartment) {
//       return res.status(404).json({ message: "Apartment not found" });
//     }
//     res.json(apartment);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.updateApartment = async (req, res) => {
//   try {
//     if (!req.session.profile) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const apartmentId = req.session.profile._id;

//     const updatedApartment = await Apartment.findByIdAndUpdate(
//       apartmentId,
//       req.body,
//       { new: true }
//     );
//     if (!updatedApartment) {
//       return res.status(404).json({ message: "Apartment not found" });
//     }
//     res.json(updatedApartment);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.deleteApartment = async (req, res) => {
//   try {
//     const { apartmentId } = req.params;
//     await Apartment.findByIdAndDelete(apartmentId);
//     res.sendStatus(204);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.setApartmentPreferences = async (req, res) => {
//   try {
//     if (!req.session.profile) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const apartmentId = req.session.profile._id;

//     const { ageRange, genderPreference, occupations, sharedInterests } =
//       req.body;

//     const updatedApartment = await Apartment.findByIdAndUpdate(apartmentId, {
//       preferences: {
//         ageRange,
//         genderPreference,
//         occupations,
//         sharedInterests,
//       },
//     });

//     if (!updatedApartment) {
//       return res.status(404).json({ message: "Apartment not found" });
//     }

//     res.status(200).json({
//       message: "Apartment preferences updated successfully",
//       apartment: updatedApartment,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating apartment preferences" });
//   }
// };

// exports.allApartments = async (req, res) => {
//   try {
//     if (!req.session.profile) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const roommateId = req.session.profile;

//     // Fetch the roommate's data, including questionnaire and preferences
//     const roommate = await Roommate.findById(roommateId).populate(
//       "questionnaire"
//     );
//     if (!roommate) {
//       return res.status(404).json({ message: "Roommate profile not found" });
//     }

//     // Fetch all apartments
//     const apartments = await Apartment.find().populate("questionnaire");

//     // Calculate compatibility scores and filter based on preferences
//     const compatibleApartments = apartments
//       .map((apartment) => {
//         // Check if the apartment matches the roommate's preferences
//         // if (!matchesPreferences(roommate.preferences, apartment)) {
//         //   console.log("Does not match preferences");
//         //   return null;
//         // }

//         // Calculate compatibility score
//         const compatibilityScore = calculateCompatibilityScore(
//           roommate.questionnaire,
//           apartment.questionnaire
//         );

//         const distance =
//           calculateDistance(
//             roommate.preferences?.location.address.coordinates,
//             apartment.info.location.coordinates
//           ) || 0;

//         // Return a new object with apartment data and compatibility score
//         const rv = {
//           apartment,
//           score: compatibilityScore,
//           sortOption: {
//             score: compatibilityScore,
//             rent: apartment.info.financials.rent,
//             distance,
//             date: apartment.info.leaseTerms.availableFrom,
//           },
//         };
//         return rv;
//       })
//       .sort((a, b) => b.score - a.score); // Sort by compatibility score (highest first)

//     res.json(compatibleApartments);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const Roommate = require("../models/roommateModel");
const Apartment = require("../models/apartmentModel");
const Question = require("../models/questionModel");
const calculateCompatibilityScore = require("../utils/matchingAlgorithm");

exports.getMatches = async (req, res) => {
  try {
    const myApartment = req.user;
    const matches = await Promise.all(
      myApartment.matches.map((matchId) =>
        Roommate.findById(matchId).populate("questionnaire")
      )
    );

    const formattedMatches = matches
      .map((match) => {
        const compatibilityScore = calculateCompatibilityScore(
          myApartment.questionnaire,
          match.questionnaire
        );

        return {
          match,
          matchInfo: {
            image: match.profilePicture,
            score: compatibilityScore,
            title: match.name,
            subTitle: `${match.age} years old`,
          },
        };
      })
      .sort((a, b) => b.matchInfo.score - a.matchInfo.score);

    res.json(formattedMatches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const myApartment = req.user;

    const formatRoommates = async (roommateIds) => {
      const roommates = await Promise.all(
        roommateIds.map((id) => Roommate.findById(id).populate("questionnaire"))
      );

      return roommates.map((roommate) => {
        const compatibilityScore = calculateCompatibilityScore(
          myApartment.questionnaire,
          roommate.questionnaire
        );

        return {
          roommate,
          score: compatibilityScore,
        };
      });
    };

    const likes = await formatRoommates(myApartment.likes);
    const dislikes = await formatRoommates(myApartment.dislikes);

    res.json({ likes, dislikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const apartment = req.user;
    const roommates = await Roommate.find().populate("questionnaire");

    const compatibleRoommates = roommates
      .filter(
        (roommate) =>
          !apartment.dislikes.includes(roommate._id) &&
          !apartment.likes.includes(roommate._id) &&
          !apartment.matches.includes(roommate._id)
      )
      // .filter((apartment) => {
      //   matchesPreferences(apartment.preferences, roommate);
      // })
      .map((roommate) => {
        const compatibilityScore = calculateCompatibilityScore(
          apartment.questionnaire,
          roommate.questionnaire
        );

        return {
          roommate,
          score: compatibilityScore,
          sortOption: {
            score: compatibilityScore,
            age: roommate.age,
            date: roommate.createdAt,
          },
        };
      })
      .sort((a, b) => b.score - a.score);

    res.json(compatibleRoommates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateApartment = async (req, res) => {
  try {
    const { questionnaire, ...otherFields } = req.body;
    let updatedApartment = req.user;

    if (questionnaire) {
      const updatedQuestionnaire = await Question.findByIdAndUpdate(
        updatedApartment.questionnaire,
        questionnaire,
        { new: true, runValidators: true }
      );

      if (!updatedQuestionnaire) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }

      updatedApartment.questionnaire = updatedQuestionnaire._id;
    }

    Object.assign(updatedApartment, otherFields);
    await updatedApartment.save();

    res.json(updatedApartment);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.setApartmentPreferences = async (req, res) => {
//   try {
//     const apartment = req.user;
//     const { ageRange, genderPreference, occupations, sharedInterests } =
//       req.body;
//     let ageRangeField = ageRange;
//     if (ageRange) {
//       ageRangeField = [ageRange.value[0], ageRange.value[1]];
//     }

//     console.log(req.body);

//     apartment.preferences = {
//       ...apartment.preferences,
//       ageRange : ageRangeField,
//       genderPreference,
//       occupations,
//       sharedInterests,
//     };

//     await apartment.save();

//     res.status(200).json({
//       message: "Apartment preferences updated successfully",
//       apartment: apartment,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating apartment preferences" });
//   }
// };

exports.setApartmentPreferences = async (req, res) => {
  try {
    const apartment = req.user;
    const { ageRange, gender, occupations, sharedInterests } = req.body;

    apartment.preferences = {
      ageRange,
      gender,
      occupations,
      sharedInterests,
    };

    await apartment.save();

    res.status(200).json({
      message: "Apartment preferences updated successfully",
      apartment: apartment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating apartment preferences" });
  }
};

exports.apartmentActions = async (req, res) => {
  try {
    const { targetId } = req.params;
    const { action } = req.query;
    const myApartment = req.user;
    console.log(targetId, action);

    const roommate = await Roommate.findById(targetId);
    if (!roommate) {
      return res.status(404).json({ message: "Roommate not found" });
    }

    switch (action) {
      case "like":
        if (!myApartment.likes.includes(roommate._id)) {
          console.log("like");
          myApartment.likes.push(roommate._id);
          myApartment.dislikes = myApartment.dislikes.filter(
            (id) => !id.equals(roommate._id)
          );
        }
        break;
      case "dislike":
        if (!myApartment.dislikes.includes(roommate._id)) {
          console.log("dislike");
          myApartment.dislikes.push(roommate._id);
          myApartment.likes = myApartment.likes.filter(
            (id) => !id.equals(roommate._id)
          );
        }
        break;

      default:
        console.log("Invalid action");
        return res.status(400).json({ message: "Invalid action" });
    }

    await myApartment.save();
    return res.json({ message: "Action successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
