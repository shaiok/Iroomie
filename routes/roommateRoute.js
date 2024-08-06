const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser,
  setRoommatePreferences,
  deleteUser,
  getMatchingSuggestions,
  getAllUsers,
  roommateActions
} = require("../controllers/roommateController");

router.get("/",getAllUsers);
router.put("/set-preferences", setRoommatePreferences);
router.put("/set-action/:apartmentId", roommateActions);
router.route("/:roommateId").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:roommateId/suggestions").get(getMatchingSuggestions);

module.exports = router;
