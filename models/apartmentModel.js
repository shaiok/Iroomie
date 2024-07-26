const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  info: {
    overview: {
      title: String,
      description: String,
      propertyType: String,
      totalCapacity: Number,
      availableRooms: Number,
    },
    location: {
      address: {
        street: String,
        city: String,
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      nearbyPlaces: [String],
    },
    specifications: {
      size: Number,
      bedrooms: Number,
      bathrooms: Number,
      floorNumber: Number,
    },
    roommates: [String],
    financials: {
      rent: Number,
      securityDeposit: Number,
    },
    leaseTerms: {
      leaseDuration: String,
      availableFrom: Date,
    },
    images: [String],
  },
  amenities: {
    general: [String],
    kitchen: [String],
    bathroom: [String],
    bedroom: [String],
    outdoor: [String],
    entertainment: [String],
    safety: [String],
  },
  details: {
    AC: Boolean,
    Parking: Boolean,
    Balcony: Boolean,
    Furnished: Boolean,
    Elevator: Boolean,
    "Pet Friendly": Boolean,
    "Smoking Allowed": Boolean,
  },
  questionnaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  preferences: {
    ageRange: [Number],
    genderPreference: String,
    occupations: [String],
    sharedInterests: [String],
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Roommate" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Roommate" }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Roommate" }],
});
const Apartment = mongoose.model("Apartment", apartmentSchema);
module.exports = Apartment;
