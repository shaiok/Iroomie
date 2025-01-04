import express, { Router } from "express";
import authRoutes from "./authRoute";
import userRoute from "./userRoute";

const router: Router = express.Router();


// Define the route structure
router.use("/auth", authRoutes);
//router.use("/roommates", roommateRoute);
//router.use("/apartments", apartmentRoute);
router.use("/users", userRoute);

export default router;
