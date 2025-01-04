import { Router } from "express";
import {
  getmatches,
  getSuggestions,
  updateUser,
  getactivity,
  setPreferences,
  setAction,
  checkUserType,
} from "../controllers/userController";

const router = Router();

// Apply the checkUserType middleware to all routes
router.use(checkUserType);

// GET routes
router.get("/suggestions", getSuggestions);
router.get("/matches", getmatches);
router.get("/activity", getactivity);

// PUT routes
router.put("/update", updateUser);
router.put("/preferences", setPreferences);
router.put("/action/:targetId", setAction);

export default router;
