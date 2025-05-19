const express = require("express");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { createBlog, updateBlog, getaBlog, getAllBlog, deleteBlog, likeBlog, disLikeBlog, uploadImages, deleteImagesBlogs } = require("../controller/blogCtrl");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");
const router = express.Router();

router.get("/get-all-blog", getAllBlog)
router.post("/", authmiddleware, isAdmin, createBlog)
router.put("/likes", authmiddleware, likeBlog)
router.put("/dislikes", authmiddleware, disLikeBlog)

// router.put("/upload/:id", authmiddleware, isAdmin, uploadPhoto.array('image', 10), uploadImages, blogImgResize)
router.put("/:id", authmiddleware, isAdmin, updateBlog)
router.get("/:id", getaBlog)
router.delete("/:id", authmiddleware, isAdmin, deleteBlog)
router.put(
  "/upload/:id",
  authmiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);
router.delete("/delete-img/:id", authmiddleware, isAdmin, deleteImagesBlogs);
module.exports = router;