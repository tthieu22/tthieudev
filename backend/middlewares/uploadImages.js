const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

// Sử dụng bộ nhớ tạm (RAM)
const multerStorage = multer.memoryStorage();

// Lọc file chỉ cho phép ảnh
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

// Cấu hình upload ảnh
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Middleware resize ảnh dùng cho sản phẩm
const productImgResize = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files) return next();

    await Promise.all(
      req.files.map(async (file, index) => {
        file.originalname = `product-${Date.now()}-${index}.jpeg`;
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

// Middleware resize ảnh dùng cho blog
const blogImgResize = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files) return next();

    await Promise.all(
      req.files.map(async (file, index) => {
        file.originalname = `blog-${Date.now()}-${index}.jpeg`;
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

// Middleware resize ảnh cho Cloudinary (có thể dùng chung)
const cloudImgResize = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files) return next();

    await Promise.all(
      req.files.map(async (file, index) => {
        file.originalname = `cloud-${Date.now()}-${index}.jpeg`;
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

module.exports = {
  uploadPhoto,
  productImgResize,
  blogImgResize,
  cloudImgResize,
};
