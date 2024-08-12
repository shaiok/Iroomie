const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoute");
const roommateRoute = require("./roommateRoute");
const apartmentRoute = require("./apartmentRoute");
const userRoute = require("./userRoute");

router.use("/auth", authRoutes);
// router.use("/roommates", roommateRoute);
// router.use("/apartments", apartmentRoute);
router.use("/users", userRoute);

module.exports = router;
