const express = require("express");
const router = express.Router();
const { isAdmin, authmiddleware } = require("../middlewares/authmiddleware");
const { createCoupon, updateCoupon, deleteCoupon, getaCoupon, getAllCoupon } = require("../controller/couponCtrl");

router.get("/", authmiddleware, isAdmin, getAllCoupon)
router.post("/", authmiddleware, isAdmin, createCoupon)
router.put("/:id", authmiddleware, isAdmin, updateCoupon)
router.delete("/:id", authmiddleware, isAdmin, deleteCoupon)
router.get("/:id", getaCoupon)

module.exports = router