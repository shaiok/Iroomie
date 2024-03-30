const express = require('express');
const router = express.Router();

// Send a new message to a chat room
router.post('/:roomId/messages', /* sendMessage controller */);

module.exports = router;