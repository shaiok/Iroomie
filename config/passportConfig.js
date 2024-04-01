const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          // Find the user by email
          const user = await User.findOne({ email });

          // If the user doesn't exist, return an error
          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          // Compare the provided password with the stored hashed password
          const isMatch = await bcrypt.compare(password, user.password);

          // If the passwords don't match, return an error
          if (!isMatch) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          // If the credentials are valid, return the user
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};