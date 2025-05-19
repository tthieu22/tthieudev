const express = require("express");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { getAllEnquiry, createEnquiry, updateEnquiry, deleteEnquiry, getaEnquiry } = require("../controller/enqCtrl");
const route = express.Router();

route.get("/", getAllEnquiry)
route.post("/", authmiddleware, isAdmin, createEnquiry)
route.put("/:id", authmiddleware, isAdmin, updateEnquiry)
route.delete("/:id", authmiddleware, isAdmin, deleteEnquiry)
route.get("/:id", getaEnquiry)
module.exports = route