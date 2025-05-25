const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const parser = new DatauriParser();

const cloudinaryUploadImg = async (fileBuffer) => {
  if (!fileBuffer) throw new Error("File buffer is missing");

  try {
    const dataUri = parser.format(".jpeg", fileBuffer); 
    const result = await cloudinary.uploader.upload(dataUri.content, {
      resource_type: "auto",
      folder: "ecommerce-digitic",
    });

    const rawPublicId = result.public_id;
    const shortPublicId = rawPublicId.split("/").pop();

    return {
      url: result.secure_url,
      asset_id: result.asset_id,
      public_id: shortPublicId,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw error;
  }
};

const cloudinaryDeleteImg = async (public_id) => {
  if (!public_id) {
    console.error("Public ID is required");
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      console.error("Failed to delete the image from Cloudinary:", result);
    }

    return result;
  } catch (error) {
    console.error("Error occurred while deleting image:", error.message);
    throw error;
  }
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
