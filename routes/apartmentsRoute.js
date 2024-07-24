const express = require("express");
const router = express.Router();

const {
  allApartments,
  getApartment,
  updateApartment,
  associateUserToApartment,
  deleteApartment,
} = require("../controllers/apartmentsController");

router.route("/").get(allApartments);
router
  .route("/:apartmentId")
  .get(getApartment)
  .put(updateApartment) 
  .delete(deleteApartment); 

router
  .route("/:apartmentId/associate/:userId")
  .post(associateUserToApartment) 
  .delete(associateUserToApartment); 

module.exports = router;
