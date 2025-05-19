const Coupon = require("../models/couponModel")
const asyncHandler = require("express-async-handler")
const { validateMongodbId } = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newcoupon = await Coupon.create(req.body)
        res.json(newcoupon)

    } catch (error) {
        throw new Error(error)
    }
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateCoupon)

    } catch (error) {
        throw new Error(error)
    }
})
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon)

    } catch (error) {
        throw new Error(error)
    }
})
const getaCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getaCoupon = await Coupon.findById(id);
        res.json(getaCoupon)

    } catch (error) {
        throw new Error(error)
    }

})
const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const getallCoupon = await Coupon.find();
        res.json(getallCoupon)

    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createCoupon, updateCoupon, deleteCoupon, getaCoupon, getAllCoupon }