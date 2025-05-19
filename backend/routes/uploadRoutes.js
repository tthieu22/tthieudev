const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { uploadPhoto, cloudImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

// Route để upload ảnh
router.put(
  "/",
  authmiddleware,
  isAdmin,
  uploadPhoto.array("images", 10), 
  cloudImgResize,
  uploadImages
);

// Route để xóa ảnh
router.delete("/delete-img/:id", authmiddleware, isAdmin, deleteImages);

module.exports = router;
