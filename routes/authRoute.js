const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../middleware/multer");

const {
  registerUser,
  registerApartment,
  loginUser,
  logoutUser,
  bulkRegister
} = require("../controllers/authController");

// New route for single-step registration
router.post("/register/user", upload.array('images', 5), registerUser); 

// New route for single-step registration
// router.route("/register/apartment").post(registerApartment);
router.post("/register/apartment", upload.array('images', 5), registerApartment);

router.post('/register/bulk', bulkRegister);

router
  .route("/login")
  .get((_req, res) => {
    res.render("login");
  })
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/admin/login",
    }),
    loginUser
  );

router.get("/logout", logoutUser);

module.exports = router;
