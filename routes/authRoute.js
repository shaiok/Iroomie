const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware/verifyToken');


// Register a new user
router.post('/register', registerUser); //verifyToken,

// User login
router.post('/login', loginUser); //verifyToken

module.exports = router;