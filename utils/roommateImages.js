require('dotenv').config();
const mongoose = require('mongoose');
const Roommate = require("../models/roommateModel");
const User = require("../models/userModel");
const Apartment = require('../models/apartmentModel');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected successfully'))
.catch((err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});

const defaultImages = [
  "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1670884442192-7b58d513cd55?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1706885093487-7eda37b48a60?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1677368597077-009727e906db?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

function getRandomDefaultImage() {
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}

async function updateRoommateImages() {
  try {
    const roommates = await Roommate.find({
      $or: [
        { 'social.profileImage': { $exists: false } },
        { 'social.profileImage': null }
      ]
    });

    console.log(`Found ${roommates.length} roommates without profile images.`);

    for (const roommate of roommates) {
      const user = await User.findById(roommate.user);

      roommate.social = roommate.social || {};

      if (user && user.picture) {
        roommate.social.profileImage = user.picture;
        console.log(`Updated profile image for roommate: ${roommate._id} with user's picture`);
      } else {
        roommate.social.profileImage = getRandomDefaultImage();
        console.log(`Assigned random default image to roommate: ${roommate._id}`);
      }

      await roommate.save();
    }

    console.log('Finished updating roommate profile images.');
  } catch (error) {
    console.error('Error updating roommate profile images:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// updateRoommateImages().then(() => process.exit(0));

async function removeApartmentPreferences() {
  try {
    const result = await Apartment.updateMany(
      {}, // match all documents
      { $unset: { preferences: "" } } // remove the preferences field
    );

    console.log(`Updated ${result.modifiedCount} apartments.`);
    console.log(`${result.matchedCount} apartments were found in total.`);

    if (result.matchedCount > result.modifiedCount) {
      console.log(`${result.matchedCount - result.modifiedCount} apartments didn't have a preferences field.`);
    }

  } catch (error) {
    console.error('Error removing apartment preferences:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

removeApartmentPreferences().then(() => process.exit(0));