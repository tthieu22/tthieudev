const express = require("express");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { getAllColor, createColor, updateColor, deleteColor, getaColor } = require("../controller/colorCtrl");
const route = express.Router();

route.get("/", getAllColor)
route.post("/", authmiddleware, isAdmin, createColor)
route.put("/:id", authmiddleware, isAdmin, updateColor)
route.delete("/:id", authmiddleware, isAdmin, deleteColor)
route.get("/:id", getaColor)
module.exports = route