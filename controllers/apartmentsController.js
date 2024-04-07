const Apartment = require('../models/apartmentModel');
const User = require('../models/userModel');

exports.getApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const apartment = await Apartment.findById(apartmentId).populate('existimgRoommates');
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.json(apartment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const updatedApartment = await Apartment.findByIdAndUpdate(apartmentId, req.body, { new: true });
    if (!updatedApartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.json(updatedApartment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.associateUserToApartment = async (req, res) => {
  try {

    const { apartmentId, userId } = req.params;
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.associateApartment !== undefined) {
        return res.status(404).json({ message: 'User already associate to an apartment' });
      }
    
    apartment.existimgRoommates.push(userId);
    user.associateApartment = apartmentId;
    await apartment.save();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    await Apartment.findByIdAndDelete(apartmentId);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};