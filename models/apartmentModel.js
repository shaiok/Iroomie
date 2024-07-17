const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  userInfo: {
    fullName: String,
    email: String,
    password: String,
    userType: String,
  },
  questionnaire: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },

  apartmentInfo: {
    address: {
      address: String,
      position: [Number, Number],
    },
    floorNumber: Number,
    rent: Number,
    bedrooms: Number,
    bathrooms: Number,
    size: Number,
    leaseLength: String,
    amenities: [String],
    nearbyPlaces: [String],
    about: String,
    images: [String],
    roommates : Number,
    roommatesName : [String],
    details: {
      heating: Boolean,
      parking: Boolean,
      balcony: Boolean,
      furnished: Boolean,
      elevator: Boolean,
      petFriendly: Boolean,
      smokingAllowed: Boolean,
    },
  },
  existingRoommates: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Apartment = mongoose.model("Apartment", apartmentSchema);
module.exports = Apartment;
