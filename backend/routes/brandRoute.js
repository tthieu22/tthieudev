const express = require("express");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { getAllBrand, createBrand, updateBrand, deleteBrand, getaBrand } = require("../controller/brandCtrl");
const route = express.Router();

route.get("/", getAllBrand)
route.post("/", authmiddleware, isAdmin, createBrand)
route.put("/:id", authmiddleware, isAdmin, updateBrand)
route.delete("/:id", authmiddleware, isAdmin, deleteBrand)
route.get("/:id", getaBrand)
module.exports = route