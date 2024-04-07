const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,
  age: Number,
  gender: { type: String, enum: ['male', 'female'] },
  about: String,
  bio: { type: mongoose.Schema.Types.ObjectId, ref: 'questionsSchema' },
  preferences: {
    importance: { type: mongoose.Schema.Types.ObjectId, ref: 'questionsSchema' },
    budget: Number,
    address: String
  },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' }],
  apartmentAssociate: { type: mongoose.Schema.Types.ObjectId , ref: 'Apartment' },
});


const User = mongoose.model('User', userSchema);

module.exports = User;