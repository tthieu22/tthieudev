const BlogCategory = require("../models/blogCatModel")
const asyncHandler = require("express-async-handler")
const { validateMongodbId } = require("../utils/validateMongodbId")

const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newProdCategory = await BlogCategory.create(req.body);
        res.json(newProdCategory)

    } catch (error) {
        throw new Error(error)
    }
})
const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const updateBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBlogCategory)

    } catch (error) {
        throw new Error(error)
    }
})
const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteBlogCategory = await BlogCategory.findByIdAndDelete(id);
        res.json(deleteBlogCategory)

    } catch (error) {
        throw new Error(error)
    }
})
const getaBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getaBlogCategory = await BlogCategory.findById(id);
        res.json(getaBlogCategory)

    } catch (error) {
        throw new Error(error)
    }

})
const getAllBlogCategory = asyncHandler(async (req, res) => {
    try {
        const getallBlogCategory = await BlogCategory.find();
        res.json(getallBlogCategory)

    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createBlogCategory, updateBlogCategory, deleteBlogCategory, getaBlogCategory, getAllBlogCategory }