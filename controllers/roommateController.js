const Roommate = require('../models/roommateModel');
const Apartment = require('../models/apartmentModel');
const calculateCompatibilityScore = require('../utils/matchingAlgorithm');


exports.getAllUsers = async (req, res) => {

  try {
    
    const users = await User.find({ 'userType': 'roommate' });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.setRoommatePreferences = async (req, res) => {
  try {
    if (!req.session.profile) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const roommateId  = req.session.profile;

    const {
      rentRange,
      bedrooms,
      bathrooms,
      minSize,
      details,
      leaseDuration,
      address,
      radius,
      moveInDateStart
    } = req.body;

    const updatedRoommate = await Roommate.findByIdAndUpdate(
      roommateId,
      {
        preferences: {
          rentRange,
          bedrooms,
          bathrooms,
          minSize,
          details,
          leaseDuration,
          address,
          radius,
          moveInDateStart: moveInDateStart ? new Date(moveInDateStart) : null
        }
      },
    );

    if (!updatedRoommate) {
      return res.status(404).json({ message: 'Roommate not found' });
    }

    res.status(200).json({ message: 'Roommate preferences updated successfully', roommate: updatedRoommate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating roommate preferences' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMatchingSuggestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('bio').populate('preferences.importance');
    console.log("Found");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const apartmentsList = await Apartment.find().populate('bio');

    const matchingSuggestionsInitials = apartmentsList.filter(apartment =>
      !user.dislikes.includes(apartment._id.toString())
    );

    const compatibilityScores = matchingSuggestionsInitials.map(apartment => {
      const apartmentBio = apartment.bio;
      const userBio = user.bio;
      const userPreferences = user.preferences.importance;

      const score = parseInt(Math.round(calculateCompatibilityScore(userBio, userPreferences, apartmentBio) * 100));

      return { score, apartmentId: apartment._id , address: apartment.address};
    });

    const sortedCompatibilityScores = compatibilityScores.sort((a, b) => b.score - a.score);

    res.json(sortedCompatibilityScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.associateUserToApartment = async (req, res) => {
  try {
    const { userId, apartmentId } = req.params;
    const { action } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    http://dsgsdgsdg/dsdsgsdgsd/?action=like

    switch (action) {
      case 'like':
        if (user.likes.includes(apartment._id)) {
          return res.status(400).json({ message: 'Already liked' });
        }
        if (user.dislikes.includes(apartment._id)) {
          user.dislikes.pull(apartment._id);
        }
        user.likes.push(apartment._id);
        break;
      case 'dislike':
        if (user.dislikes.includes(apartment._id)) {
          return res.status(400).json({ message: 'Already disliked' });
        }
        if (user.likes.includes(apartment._id)) {
          user.likes.pull(apartment._id);
        }
        user.dislikes.push(apartment._id);
        break;
      case 'unlike':
        if (!user.likes.includes(apartment._id)) {
          return res.status(400).json({ message: 'Not liked' });
        }
        user.likes.pull(apartment._id);
        break;
      case 'message':
        // Start conversation
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();
    return res.json({ message: 'Action successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};