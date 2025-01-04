import multer, { StorageEngine } from "multer";

// Define the storage configuration for multer
const storage: StorageEngine = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

// Create the multer instance with custom storage and limits
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 25 * 1024 * 1024, // 25MB limit for fields
    fileSize: 25 * 1024 * 1024,  // 25MB limit for file uploads
  },
});

export default upload;
