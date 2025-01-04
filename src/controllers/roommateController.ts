import { Request, Response } from "express";
import Roommate, { IRoommate } from "../models/roommateModel";
import Apartment, { IApartment } from "../models/apartmentModel";
import Question, { IQuestion } from "../models/questionModel";
import calculateCompatibilityScore from "../utils/matchingAlgorithm";
import { calculateDistance } from "../utils/utilsFunction";
import { ObjectId, Types } from "mongoose";
import { HydratedDocument } from "mongoose";



export const getMatches = async (req: Request, res: Response) => {
  try {
    // Fetch the roommate and its questionnaire reference
    const roommate = await Roommate.findById(req.user._id);
    if (!roommate) {
      return res.status(404).json({ message: "Roommate not found" });
    }

    // Fetch the roommate's questionnaire from the database
    const roommateQuestionnaire = await Question.findById(roommate.questionnaire);
    if (!roommateQuestionnaire) {
      return res.status(400).json({ message: "Roommate questionnaire not found" });
    }

    if (!roommate.matches || roommate.matches.length === 0) {
      return res.status(400).json({ message: "No matches found for the user" });
    }

    // Fetch matches and their questionnaires
    const matches = await Promise.all(
      roommate.matches.map(async (matchId: Types.ObjectId) => {
        const match = await Apartment.findById(matchId);
        if (!match) return null;

        const matchQuestionnaire = await Question.findById(match.questionnaire);
        if (!matchQuestionnaire) return null;

        return { match, matchQuestionnaire };
      })
    );

  // Filter and map matches
const formattedMatches = matches
.filter(
  (match): match is {
    match: HydratedDocument<IApartment>;
    matchQuestionnaire: HydratedDocument<IQuestion>;
  } => match !== null && match.matchQuestionnaire !== null
) // Filter out null matches and ensure matchQuestionnaire exists
.map(({ match, matchQuestionnaire }) => {
  const compatibilityScore = calculateCompatibilityScore(
    roommateQuestionnaire,
    matchQuestionnaire
  );
  
  const roommateCoordinates = roommate.preferences?.location?.address?.coordinates;
  const matchCoordinates = match.info?.location?.coordinates;
  let distance =0
  if (roommateCoordinates && matchCoordinates) {
   distance = calculateDistance(roommateCoordinates, matchCoordinates) as number;
    // Use distance as needed
  } else {
     ;
    // Handle the case where either coordinate is undefined
    console.error("Coordinates are missing for either roommate or match.");
  }
  
      return {
        match,
        matchInfo: {
          image: match.info?.images?.[0],
          score: compatibilityScore,
          title: `${match.info?.location?.address?.street ?? "Unknown street"}, ${
            match.info?.location?.address?.city ?? "Unknown city"
          }`,
          subTitle: `${match.info?.financials?.rent}₪ /m`,
          distance,
        },
      };
    });
  

    res.status(200).json({ matches: formattedMatches });
  } catch (error) {
    console.error(error );

  if (error instanceof Error) {
    // Safely access the error's message property
    res.status(500).json({ message: "An error occurred", error: error.message });
  } else {
    // Handle unexpected error types
    res.status(500).json({ message: "An unexpected error occurred" });
  }
}
};



export const getActivity = async (req: Request, res: Response) => {
  try {
    const roommate = await Roommate.findById(req.user._id).populate('questionnaire') as IRoommate;
    if (!roommate) {
      return res.status(404).json({ message: "Roommate not found" });
    }

    if (!roommate.likes || !roommate.dislikes) {
      return res.status(400).json({ message: "No likes or dislikes found for the user" });
    }

    if (!roommate.questionnaire) {
      return res.status(400).json({ message: "Roommate questionnaire is undefined" });
    }

      // Fetch the apartment's questionnaire from the database
      const roommateQuestionnaire = await Question.findById(roommate.questionnaire);
      if (!roommateQuestionnaire) {
        return res.status(400).json({ message: "Apartment questionnaire not found" });
      }

    // Helper to format apartments
    const formatApartments = async (apartmentIds: Types.ObjectId[]) => {
      const apartments = await Promise.all(
        apartmentIds.map(async (id) => {
          const apartment = await Apartment.findById(id);
          if (!apartment) return null;

          const apartmentQuestionnaire = await Question.findById(apartment.questionnaire);
          if (!apartmentQuestionnaire) return null;

          return { apartment, apartmentQuestionnaire };
        })
      );

      return apartments
        .filter(
          (result): result is {
            apartment: HydratedDocument<IApartment>;
            apartmentQuestionnaire: HydratedDocument<IQuestion>;
          } => result !== null && result.apartmentQuestionnaire !== null
        )
        .map(({ apartment, apartmentQuestionnaire }) => {
          const compatibilityScore = calculateCompatibilityScore(
            roommateQuestionnaire,
            apartmentQuestionnaire
          );

          return { apartment, score: compatibilityScore };
        });
    };

    // Format likes and dislikes
    const likes = await formatApartments(roommate.likes);
    const dislikes = await formatApartments(roommate.dislikes);

    res.json({ likes, dislikes });
  } catch (err) {
    console.error("Error fetching activity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const roommate = await Roommate.findById(req.user._id).populate('questionnaire') as IRoommate;
    if (!roommate) {
      return res.status(404).json({ message: "Roommate not found" });
    }

    const dislikes = roommate.dislikes ?? [];
    const likes = roommate.likes ?? [];
    const matches = roommate.matches ?? [];

    if (!roommate.questionnaire) {
      return res.status(400).json({ message: "Roommate questionnaire is undefined" });
    }

     // Fetch the apartment's questionnaire
     const roommateQuestionnaire = await Question.findById(roommate.questionnaire);
     if (!roommateQuestionnaire) {
       return res.status(400).json({ message: "Roommate questionnaire not found" });
     }


    // Fetch all apartments and their questionnaires
    const apartments = await Apartment.find();
    const apartmentsWithQuestionnaires = await Promise.all(
      apartments.map(async (apartment) => {
        const questionnaire = await Question.findById(apartment.questionnaire);
        if (!questionnaire) return null;
        return { apartment, questionnaire };
      })
    );

    // Filter compatible apartments
    const compatibleApartments = apartmentsWithQuestionnaires
      .filter(
        (result): result is { apartment: HydratedDocument<IApartment>; questionnaire: HydratedDocument<IQuestion> } =>
          result !== null &&
          !dislikes.includes(result.apartment._id as Types.ObjectId) &&
          !likes.includes(result.apartment._id as Types.ObjectId) &&
          !matches.includes(result.apartment._id as Types.ObjectId)
      )
      .map(({ apartment, questionnaire }) => {
        const compatibilityScore = calculateCompatibilityScore(
          roommateQuestionnaire,
          questionnaire
        );

        const roommateCoordinates = roommate.preferences?.location?.address?.coordinates;
        const apartmentCoordinates = apartment.info?.location?.coordinates;
        const distance =
          roommateCoordinates && apartmentCoordinates
            ? calculateDistance(roommateCoordinates, apartmentCoordinates)
            : null;

        return {
          apartment,
          score: compatibilityScore,
          sortOption: {
            score: compatibilityScore,
            rent: apartment.info?.financials?.rent ?? "N/A",
            distance: distance ?? "N/A",
            date: apartment.info?.leaseTerms?.availableFrom ?? new Date(),
          },
        };
      });

    // Sort compatible apartments by score
    compatibleApartments.sort((a, b) => b.score - a.score);

    res.json(compatibleApartments);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const setRoommatePreferences = async (req: Request, res: Response) => {
  try {
    const roommate = req.user as IRoommate;

    let {
      overview = undefined,
      details = undefined,
      leaseDuration = undefined,
      location = undefined,
    } = req.body;

    if (!location?.address?.street || !location?.address?.city) {
      location = undefined;
    }

    if (leaseDuration?.moveInDateStart) {
      leaseDuration.moveInDateStart = new Date(leaseDuration.moveInDateStart);
    }

    const updatedRoommate = await Roommate.findByIdAndUpdate(
      roommate._id,
      { preferences: { overview, details, location, leaseDuration } },
      { new: true, runValidators: true }
    );

    if (!updatedRoommate) {
      return res.status(404).json({ message: 'Roommate not found' });
    }

    res.status(200).json({
      message: 'Roommate preferences updated successfully',
      roommate: updatedRoommate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating roommate preferences' });
  }
};

export const roommateActions = async (req: Request, res: Response) => {
  try {
    const { targetId } = req.params;
    const { action } = req.query;
    const roommate = req.user as IRoommate;

    if (!roommate.likes || !roommate.dislikes) {
      return res.status(400).json({ message: 'Incomplete user data' });
    }

    const apartment = await Apartment.findById(targetId);
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    switch (action) {
      case 'like':
        if (!roommate.likes.includes(apartment._id as Types.ObjectId )) {
          roommate.likes.push(apartment._id  as Types.ObjectId);
          roommate.dislikes = roommate.dislikes.filter(
            (id) => !id.equals(apartment._id  as Types.ObjectId)
          );
        }
        break;
      case 'dislike':
        if (!roommate.dislikes.includes(apartment._id  as Types.ObjectId)) {
          roommate.dislikes.push(apartment._id  as Types.ObjectId);
          roommate.likes = roommate.likes.filter(
            (id) => !id.equals(apartment._id  as Types.ObjectId)
          );
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await roommate.save();
    res.json({ message: 'Action successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { questionnaire, ...otherFields } = req.body;
    let updatedUser = req.user;

    if (!updatedUser || !updatedUser._id) {
      return res.status(404).json({ message: "User not found" });
    }

    if (questionnaire) {
      const questionnaireId = questionnaire._id;

      // Update the questionnaire document
      const updatedQuestionnaire = await Question.findByIdAndUpdate(
        questionnaireId,
        questionnaire,
        { new: true, runValidators: true }
      );

      if (!updatedQuestionnaire) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }

      // Update the user with the updated questionnaire and other fields
      updatedUser = await Roommate.findByIdAndUpdate(
        updatedUser._id,
        {
          questionnaire: updatedQuestionnaire._id,
          ...otherFields,
        },
        { new: true, runValidators: true }
      ).populate("questionnaire");
    } else {
      // Update the user without modifying the questionnaire
      updatedUser = await Roommate.findByIdAndUpdate(
        updatedUser._id,
        otherFields,
        { new: true, runValidators: true }
      ).populate("questionnaire");
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "Failed to update" });
    }

    res.json(updatedUser);
  } catch (err: any) {
    console.error("Error updating user:", err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

