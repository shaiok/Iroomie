const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  googleId: { type: String },
  fullName: { type: String },
  userType: {
    type: String,
    enum: ['roommate', 'apartment' , 'pending'],
    required: true
  },
  picture: { type: String },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userType'
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;