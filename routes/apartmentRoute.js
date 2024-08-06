const express = require("express");
const router = express.Router();

const {
  allApartments,
  getApartment,
  updateApartment,
  setApartmentPreferences,
  deleteApartment,
} = require("../controllers/apartmentController");

router.route("/").get(allApartments);
router.put("/set-preferences", setApartmentPreferences);
router
  .route("/:apartmentId")
  .get(getApartment)
  .put(updateApartment)
  .delete(deleteApartment);

module.exports = router;
