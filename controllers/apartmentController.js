const Apartment = require("../models/apartmentModel");
const User = require("../models/roommateModel");

exports.allApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

exports.setApartmentPreferences = async (req, res) => {
  try {
    if (!req.session.profile) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const apartmentId  = req.session.profile._id;

    const {
      ageRange,
      genderPreference,
      occupations,
      sharedInterests
    } = req.body;

    const updatedApartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      {
        preferences: {
          ageRange,
          genderPreference,
          occupations,
          sharedInterests
        }
      },
    );

    if (!updatedApartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    res.status(200).json({ message: 'Apartment preferences updated successfully', apartment: updatedApartment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating apartment preferences' });
  }
};

exports.associateUserToApartment = async (req, res) => {
  try {
    const { apartmentId, userId } = req.params;
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.associateApartment !== undefined) {
      return res
        .status(404)
        .json({ message: "User already associate to an apartment" });
    }

    apartment.existimgRoommates.push(userId);
    user.associateApartment = apartmentId;
    await apartment.save();
    res.sendStatus(204);
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
