const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userType: String ,
  userInfo: {
    fullName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    password: { type: String },
  },
  questionnaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  roommateInfo: {
    fullName: String,
    image : String,
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    from : String,
    occupation: {
      title: String,
      category: String,
    },
    education: String,
    hobbies: [String],
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
    },
    availability: String,
    about: String,
  },

  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
