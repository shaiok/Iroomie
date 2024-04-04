const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });
    return token;
  } catch (err) {
    console.error('Error generating token:', err);
    throw err; // Handle or log the error as per your application's requirements
  }
};
module.exports = generateToken;
