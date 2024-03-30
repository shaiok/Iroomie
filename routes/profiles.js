const express = require('express');
const router = express.Router();

// Get a user's profile
router.get('/:userId', /* getUserProfile controller */);

// Update a user's profile
router.put('/:userId', /* updateUserProfile controller */);

// Delete a user's profile
router.delete('/:userId', /* deleteUserProfile controller */);

module.exports = router;