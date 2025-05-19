const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 },
});

const productImgResize = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files) return next();

    const dir = path.join(__dirname, "../public/images/products");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filenames = [];

    await Promise.all(
      req.files.map(async (file, index) => {
        const timestamp = Date.now();
        const filename = `product-${timestamp}-${index}.jpeg`;
        const filePath = path.join(dir, filename);

        await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(filePath);

        filenames.push(filename);
      })
    );

    req.savedFilenames = filenames;
    next();
  } catch (error) {
    next(error);
  }
});

const blogImgResize = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files) return next();

    const dir = path.join(__dirname, "../public/images/blogs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filenames = [];

    await Promise.all(
      req.files.map(async (file, index) => {
        const timestamp = Date.now();
        const filename = `blog-${timestamp}-${index}.jpeg`;
        const filePath = path.join(dir, filename);

        await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(filePath);

        filenames.push(filename);
      })
    );

    req.savedFilenames = filenames;
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware resize ảnh cho Cloudinary upload
const cloudImgResize = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files) return next();

    await Promise.all(
      req.files.map(async (file, index) => {
        file.buffer = await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();
      })
    );

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = { uploadPhoto, productImgResize, blogImgResize, cloudImgResize };
