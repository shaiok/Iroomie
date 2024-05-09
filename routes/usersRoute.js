const express = require('express');
const router = express.Router();
const { getUser, updateUser, deleteUser , getMatchingSuggestions , associateUserToApartment} = require('../controllers/usersController');

router.route('/:userId')
    .get(getUser)
    .put( updateUser) 
    .delete( deleteUser); 


router.route('/:userId/suggestions')
    .get( getMatchingSuggestions) ;


router.route('/:userId/:apartmentId/')
    .post( associateUserToApartment),


    

module.exports = router;