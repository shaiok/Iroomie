const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Question = require('../models/questionModel');
const Apartment = require('../models/apartmentModel');

// Register a new user (single-step registration)
const registerUser = async (userData) => {
  const { username, email, password, fullName, age, gender, bio, preferences } = userData;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create bio and preference Question documents
  const bioQuestion = new Question({ ...bio });
  const savedBioQuestion = await bioQuestion.save();

  const preferenceQuestion = new Question({ ...preferences.importance });
  const savedPreferenceQuestion = await preferenceQuestion.save();

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    fullName,
    age,
    gender,
    bio: savedBioQuestion._id,
    preferences: {
      importance: savedPreferenceQuestion._id,
      budget: preferences.budget,
      address: preferences.address,
    }
  });

  // Save the user to the database
  await newUser.save();
};

exports.registerUser = async (req, res) => {
  try {
    const userData = req.body;

    await registerUser(userData);

    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.registerUsers = async (req, res) => {
  try {
    const users = req.body; // Assuming req.body.users is an array of user objects  

    // Array to store promises for saving users
    const savePromises = users.map(user => registerUser(user));

    // Execute all save promises concurrently
    await Promise.all(savePromises);

    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


const registerApartment = async (apartmentData) => {

  const { username, email, password, fullName, age, gender } = apartmentData.user;
  const { geoLocation, address, rent, amenities, bedrooms, bathrooms, about, bio, importance } = apartmentData.apartment;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create bio and preference Question documents
  const bioQuestion = new Question({ ...bio });
  const savedBioQuestion = await bioQuestion.save();

  const importanceQuestion = new Question({ ...importance });
  const savedImportanceQuestion = await importanceQuestion.save();

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    fullName,
    age,
    gender
  });

  const newApartment = new Apartment({
    geoLocation,
    address,
    rent,
    amenities,
    bedrooms,
    bathrooms,
    about,
    bio: savedBioQuestion,
    importance: savedImportanceQuestion
  });
  newApartment.existimgRoommates.push(newUser)
  newUser.apartmentAssociate = newApartment._id;
  // Save the newApartment to the database
  await newUser.save();
  await newApartment.save();
};


exports.registerApartment = async (req, res) => {
  try {
    const apartmentData = req.body;

    await registerApartment(apartmentData);

    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


exports.registerApartments = async (req, res) => {
  try {
    const apartments = req.body; // Assuming req.body.users is an array of user objects  

    // Array to store promises for saving users
    const savePromises = apartments.map(apartment => registerApartment(apartment));

    // Execute all save promises concurrently
    await Promise.all(savePromises);

    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Login user
exports.loginUser = (req, res, next) => {
  // Store user information in the session
  req.session.user = {
    id: req.user._id,
    email: req.user.email,
    apartmentAssociate: req.user.apartmentAssociate || '',
  };

  console.log(req.session.user);

  res.json({ message: 'Login successful' });
};

// Logout user
exports.logoutUser = (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful' });
};

