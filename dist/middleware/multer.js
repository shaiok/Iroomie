"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Define the storage configuration for multer
const storage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});
// Create the multer instance with custom storage and limits
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fieldSize: 25 * 1024 * 1024, // 25MB limit for fields
        fileSize: 25 * 1024 * 1024, // 25MB limit for file uploads
    },
});
exports.default = upload;
