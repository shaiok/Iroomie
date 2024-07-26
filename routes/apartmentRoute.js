const express = require("express");
const router = express.Router();

const {
  allApartments,
  getApartment,
  updateApartment,
  setApartmentPreferences,
  associateUserToApartment,
  deleteApartment,
} = require("../controllers/apartmentController");

router.route("/").get(allApartments);
router.put("/set-preferences", setApartmentPreferences);
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
