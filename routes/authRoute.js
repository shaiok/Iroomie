const express = require('express');
const router = express.Router();
const { registerUser, registerUsers, registerApartment, registerApartments,loginUser } = require('../controllers/authController');
const questionsMap = require('../utils/questionsMap');

// New route for single-step registration
router.route('/register/user')
  .get((_req, res) => {
    res.render('register', questionsMap);
  })
  .post(registerUser);

  router.post('/register/users', registerUsers);


  // New route for single-step registration
router.route('/register/apartment')
.get((_req, res) => {
  res.render('register', questionsMap);
})
.post(registerApartment);



router.route('/login')
  .get((_req, res) => {
    res.render('login');
  })
  .post(loginUser);

module.exports = router;