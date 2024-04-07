const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware/ensureAuthenticated');
const { getUser, updateUser, deleteUser } = require('../controllers/usersController');

router.route('/:userId')
    .get(getUser)
    .put( updateUser) // ensureAuthenticated,
    .delete( deleteUser); // ensureAuthenticated,

module.exports = router;