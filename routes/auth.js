const express = require('express');
const router = express.Router();

// Register a new user
router.post('/register', /* registerUser controller */);

// User login
router.post('/login', /* loginUser controller */);

module.exports = router;