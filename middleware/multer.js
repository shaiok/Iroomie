const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 25 * 1024 * 1024, // 25MB limit
    fileSize: 25 * 1024 * 1024,  // 25MB limit for file uploads
  }
});

module.exports = upload;