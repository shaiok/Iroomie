"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Apply the checkUserType middleware to all routes
router.use(userController_1.checkUserType);
// GET routes
router.get("/suggestions", userController_1.getSuggestions);
router.get("/matches", userController_1.getmatches);
router.get("/activity", userController_1.getactivity);
// PUT routes
router.put("/update", userController_1.updateUser);
router.put("/preferences", userController_1.setPreferences);
router.put("/action/:targetId", userController_1.setAction);
exports.default = router;
