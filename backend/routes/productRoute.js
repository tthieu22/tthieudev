const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  getAllProductsWithMeta,
  updateProduct,
  deleteProduct,
  addToWish,
  rating,
  uploadImages,
  deleteImagesProduct,
} = require("../controller/productCtrl");
const { isAdmin, authmiddleware } = require("../middlewares/authmiddleware");
const {handleChat} = require("../controller/chatbot");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");

const router = express.Router();

router.get("/infinite", getAllProductsWithMeta);
router.get("/:id", getaProduct);
router.put("/wishlist/", authmiddleware, addToWish);
router.put("/ratings/", authmiddleware, rating);
router.put("/:id", authmiddleware, isAdmin, updateProduct);
router.get("/", getAllProduct);
router.post("/", authmiddleware, isAdmin, createProduct);
router.delete("/:id", authmiddleware, isAdmin, deleteProduct);
router.put(
  "/upload/:id",
  authmiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.delete("/delete-img/:id", authmiddleware, isAdmin, deleteImagesProduct);
router.post("/chat", handleChat);

module.exports = router;
