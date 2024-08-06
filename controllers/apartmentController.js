const Apartment = require("../models/apartmentModel");
const Roommate = require("../models/roommateModel");
const calculateCompatibilityScore = require("../utils/matchingAlgorithm");

exports.getApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const apartment = await Apartment.findById(apartmentId).populate(
      "existimgRoommates"
    );
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    res.json(apartment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const updatedApartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      req.body,
      { new: true }
    );
    if (!updatedApartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    res.json(updatedApartment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    await Apartment.findByIdAndDelete(apartmentId);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.setApartmentPreferences = async (req, res) => {
  try {
    if (!req.session.profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const apartmentId = req.session.profile._id;

    const { ageRange, genderPreference, occupations, sharedInterests } =
      req.body;

    const updatedApartment = await Apartment.findByIdAndUpdate(apartmentId, {
      preferences: {
        ageRange,
        genderPreference,
        occupations,
        sharedInterests,
      },
    });

    if (!updatedApartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    res
      .status(200)
      .json({
        message: "Apartment preferences updated successfully",
        apartment: updatedApartment,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating apartment preferences" });
  }
};

exports.allApartments = async (req, res) => {
  try {
    if (!req.session.profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const roommateId = req.session.profile;

    // Fetch the roommate's data, including questionnaire and preferences
    const roommate = await Roommate.findById(roommateId).populate(
      "questionnaire"
    );
    if (!roommate) {
      return res.status(404).json({ message: "Roommate profile not found" });
    }

    // Fetch all apartments
    const apartments = await Apartment.find().populate("questionnaire");

    // Calculate compatibility scores and filter based on preferences
    const compatibleApartments = apartments
      .map((apartment) => {
        // Check if the apartment matches the roommate's preferences
        // if (!matchesPreferences(roommate.preferences, apartment)) {
        //   console.log("Does not match preferences");
        //   return null;
        // }

        // Calculate compatibility score
        const compatibilityScore = calculateCompatibilityScore(
          roommate.questionnaire,
          apartment.questionnaire
        );

        // Return a new object with apartment data and compatibility score
        const rv = { apartment , score : compatibilityScore};
        return rv;
      })
      .sort((a, b) => b.score - a.score); // Sort by compatibility score (highest first)

    res.json(compatibleApartments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

function matchesPreferences(roommatePreferences, apartment) {
  // Check if the apartment matches the roommate's preferences
  if (
    roommatePreferences.rentRange &&
    apartment.info.financials.rent > roommatePreferences.rentRange
  ) {
    return false;
  }
  if (
    roommatePreferences.bedrooms &&
    apartment.info.specifications.bedrooms < roommatePreferences.bedrooms
  ) {
    return false;
  }
  if (
    roommatePreferences.bathrooms &&
    apartment.info.specifications.bathrooms < roommatePreferences.bathrooms
  ) {
    return false;
  }
  if (
    roommatePreferences.minSize &&
    apartment.info.specifications.size < roommatePreferences.minSize
  ) {
    return false;
  }

  // Check location preferences if set
  if (roommatePreferences.address && roommatePreferences.radius) {
    const distance = calculateDistance(
      roommatePreferences.address.coordinates,
      apartment.info.location.coordinates
    );
    if (distance > roommatePreferences.radius) {
      return false;
    }
  }

  // Check other details preferences
  for (const [key, value] of Object.entries(roommatePreferences.details)) {
    if (value && !apartment.details[key]) {
      return false;
    }
  }

  return true;
}

function calculateDistance(coord1, coord2) {
  return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
}
