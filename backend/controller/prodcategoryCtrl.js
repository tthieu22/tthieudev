const ProdCategory = require("../models/prodcategoryModel")
const asyncHandler = require("express-async-handler")
const { validateMongodbId } = require("../utils/validateMongodbId")

const createProdCategory = asyncHandler(async (req, res) => {
    try {
        const newProdCategory = await ProdCategory.create(req.body);
        res.json(newProdCategory)

    } catch (error) {
        throw new Error(error)
    }
})
const updateProdCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const updateProdCategory = await ProdCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateProdCategory)

    } catch (error) {
        throw new Error(error)
    }
})
const deleteProdCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteProdCategory = await ProdCategory.findByIdAndDelete(id);
        res.json(deleteProdCategory)

    } catch (error) {
        throw new Error(error)
    }
})
const getaProdCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getaProdCategory = await ProdCategory.findById(id);
        res.json(getaProdCategory)

    } catch (error) {
        throw new Error(error)
    }

})
const getAllProdCategory = asyncHandler(async (req, res) => {
    try {
        const getallProdCategory = await ProdCategory.find();
        res.json(getallProdCategory)

    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createProdCategory, updateProdCategory, deleteProdCategory, getaProdCategory, getAllProdCategory }