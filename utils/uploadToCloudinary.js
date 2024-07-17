const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

async function uploadToCloudinary(files) {
  try {
    if (!files) {
      throw new Error("No files provided");
    }

    // If single file, convert to array
    const fileArray = Array.isArray(files) ? files : [files];

    const uploadPromises = fileArray.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        });
      });
    });

    const urls = await Promise.all(uploadPromises);
    
    // If input was a single file, return a single URL, otherwise return array of URLs
    return Array.isArray(files) ? urls : urls[0];
  } catch (error) {
    console.error("Error in uploadToCloudinary function:", error);
    throw error;
  }
}

module.exports = uploadToCloudinary;