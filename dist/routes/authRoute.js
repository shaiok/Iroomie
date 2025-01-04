"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const multer_1 = __importDefault(require("../middleware/multer"));
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Route for Google OAuth login
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Google OAuth callback route
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), authController_1.googleAuthCallback);
// Test routes
router.get("/testRoommate", authController_1.testRoommate);
router.get("/testApartment", authController_1.testApartment);
// Route to get the current logged-in user
router.get("/current-user", authController_1.getCurrentUser);
// Roommate registration route
router.post("/register/complete/roommate", multer_1.default.array("images", 1), authController_1.completeRoommateRegistration);
// Apartment registration route
router.post("/register/complete/apartment", multer_1.default.array("images", 5), authController_1.completeApartmentRegistration);
// Bulk registration route
router.post("/register/bulk", authController_1.bulkRegistration);
// Logout route
router.get("/logout", authController_1.logout);
exports.default = router;
