const passwordAuthenticated = (req, res, next) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  console.log("password " + req.body.password);
  if (passwordRegex.test(req.body.password)) {

    return next();
  }
  res.status(401).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
};

module.exports = { passwordAuthenticated };