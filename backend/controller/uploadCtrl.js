const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const uploadResult = await cloudinaryUploadImg(file.buffer);
      uploadedImages.push(uploadResult);
    }

    res.status(200).json(uploadedImages);
  } catch (error) {
    res.status(500).json({ message: `Upload failed: ${error.message}` });
  }
});

const deleteImages = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await cloudinaryDeleteImg(`ecommerce-digitic/${id}`);
    res.json({ message: "Image deleted", result: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { uploadImages, deleteImages };
