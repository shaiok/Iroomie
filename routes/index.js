const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoute");
const roommateRoute = require("./roommateRoute");
const apartmentRoute = require("./apartmentRoute");

router.use("/auth", authRoutes);
router.use("/roommates", roommateRoute);
router.use("/apartments", apartmentRoute);

module.exports = router;
