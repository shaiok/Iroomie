import { Router } from "express";
import passport from "passport";
import upload from "../middleware/multer";
import {
  googleAuthCallback,
  testRoommate,
  testApartment,
  getCurrentUser,
  completeRoommateRegistration,
  completeApartmentRegistration,
  bulkRegistration,
  logout,
} from "../controllers/authController";

const router = Router();

// Route for Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthCallback
);

// Test routes
router.get("/testRoommate", testRoommate);
router.get("/testApartment", testApartment);

// Route to get the current logged-in user
router.get("/current-user", getCurrentUser);

// Roommate registration route
router.post(
  "/register/complete/roommate",
  upload.array("images", 1),
  completeRoommateRegistration
);

// Apartment registration route
router.post(
  "/register/complete/apartment",
  upload.array("images", 5),
  completeApartmentRegistration
);

// Bulk registration route
router.post("/register/bulk", bulkRegistration);

// Logout route
router.get("/logout", logout);

export default router;
