"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
function uploadToCloudinary(files) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!files) {
                throw new Error("No files provided");
            }
            // If single file, convert to array
            const fileArray = Array.isArray(files) ? files : [files];
            const uploadPromises = fileArray.map((file) => {
                return new Promise((resolve, reject) => {
                    cloudinary_1.v2.uploader.upload(file.path, (error, result) => {
                        if (error) {
                            console.error("Error uploading to Cloudinary:", error);
                            reject(error);
                        }
                        else {
                            resolve(result.secure_url);
                        }
                    });
                });
            });
            const urls = yield Promise.all(uploadPromises);
            // If input was a single file, return a single URL, otherwise return array of URLs
            return Array.isArray(files) ? urls : urls[0];
        }
        catch (error) {
            console.error("Error in uploadToCloudinary function:", error);
            throw error;
        }
    });
}
exports.default = uploadToCloudinary;
