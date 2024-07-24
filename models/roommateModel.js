const mongoose = require("mongoose");

const roommateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    name: String,
    age: Number,
    gender: String,
    occupation: String,
    education: String,
    hometown: String,
  },
  interests: {
    hobbies: [String],
    music: [String],
    movies: [String],
    sports: [String],
  },
  social: {
    bio: String,
    profileImage: String,
    socialMedia: {
      facebook: String,
      instagram: String,
    },
  },
  questionnaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }],
});



const Roommate = mongoose.model("Roommate", roommateSchema);
module.exports = Roommate;