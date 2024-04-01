const express = require('express');
const router = express.Router();

// Get a user's preferences
router.get('/:userId', /* getUserPreferences controller */);

// Update a user's preferences
router.put('/:userId', /* updateUserPreferences controller */);

module.exports = router;