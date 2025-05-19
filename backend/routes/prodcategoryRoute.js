const express = require("express");
const { createProdCategory, updateProdCategory, deleteProdCategory, getAllProdCategory, getaProdCategory } = require("../controller/prodcategoryCtrl");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const route = express.Router();

route.get("/", getAllProdCategory)
route.post("/", authmiddleware, isAdmin, createProdCategory)
route.put("/:id", authmiddleware, isAdmin, updateProdCategory)
route.delete("/:id", authmiddleware, isAdmin, deleteProdCategory)
route.get("/:id", getaProdCategory)
module.exports = route