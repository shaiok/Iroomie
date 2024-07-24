const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoute");
const userRoutes = require("./usersRoute");
const apartmentsRoutes = require("./apartmentsRoute");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/apartments", apartmentsRoutes);

module.exports = router;
