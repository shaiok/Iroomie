const express = require('express');
const router = express.Router();

// Create a new apartment listing
router.post('/', /* createApartment controller */);

// Get a list of apartment listings
router.get('/', /* getApartments controller */);

// Get details of a specific apartment
router.get('/:apartmentId', /* getApartment controller */);

// Update an apartment listing
router.put('/:apartmentId', /* updateApartment controller */);

// Delete an apartment listing
router.delete('/:apartmentId', /* deleteApartment controller */);

module.exports = router;