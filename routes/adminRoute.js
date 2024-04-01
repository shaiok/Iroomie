const express = require('express');
const router = express.Router();

// Get a list of all users
router.get('/users', /* getAllUsers controller */);

// Get details of a specific user
router.get('/users/:userId', /* getUser controller */);

// Update a user's details
router.put('/users/:userId', /* updateUser controller */);

// Delete a user
router.delete('/users/:userId', /* deleteUser controller */);

module.exports = router;