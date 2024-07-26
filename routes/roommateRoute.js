const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser,
  setRoommatePreferences,
  deleteUser,
  getMatchingSuggestions,
  associateUserToApartment,
  getAllUsers,
} = require("../controllers/roommateController");

router.route("/").get(getAllUsers);

router.put("/set-preferences", setRoommatePreferences);
router.route("/:roommateId").get(getUser).put(updateUser).delete(deleteUser);

router.route("/:roommateId/suggestions").get(getMatchingSuggestions);

router.route("/:roommateId/:apartmentId/").post(associateUserToApartment),
  (module.exports = router);
