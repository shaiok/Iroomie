const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware/ensureAuthenticated');
const { getApartment, updateApartment, associateUserToApartment, deleteApartment } = require('../controllers/apartmentsController');

router.route('/:apartmentId')
    .get(getApartment)
    .put( updateApartment) //ensureAuthenticated,
    .delete( deleteApartment); //ensureAuthenticated,

router.route('/:apartmentId/associate/:userId')
    .post( associateUserToApartment) //ensureAuthenticated,
    .delete( associateUserToApartment) //ensureAuthenticated,

module.exports = router;