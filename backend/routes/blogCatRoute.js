const express = require("express");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { getAllBlogCategory, createBlogCategory, updateBlogCategory, deleteBlogCategory, getaBlogCategory } = require("../controller/blogCatCtrl");
const route = express.Router();

route.get("/", getAllBlogCategory)
route.post("/", authmiddleware, isAdmin, createBlogCategory)
route.put("/:id", authmiddleware, isAdmin, updateBlogCategory)
route.delete("/:id", authmiddleware, isAdmin, deleteBlogCategory)
route.get("/:id", getaBlogCategory)
module.exports = route