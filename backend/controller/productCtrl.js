const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const {cloudinaryUploadImg , cloudinaryDeleteImg} = require("../utils/cloudinary");
const { validateMongodbId } = require("../utils/validateMongodbId");
const fs = require('fs');

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newproduct = await Product.create(req.body);
    res.json(newproduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProdcut = await Product.findById(id);
    res.json(findProdcut);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => { 
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);  // sửa biến đúng queryObj

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); 
    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");  // sửa createdAt đúng chính tả
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit; 
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page doesn't exists ");
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products with meta data
const getAllProductsWithMeta = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };

    if (queryObj.search) {
      queryObj.title = { $regex: queryObj.search, $options: "i" };
      delete queryObj.search;
    }

    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const productCount = await Product.countDocuments(JSON.parse(queryStr));
    const products = await query;

    res.json({
      products,
      totalProducts: productCount,
      totalPages: Math.ceil(productCount / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      if (product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          await cloudinaryDeleteImg(`ecommerce-digitic/${product.images[i].public_id}`);
        }
      }
      const deletedProduct = await Product.findByIdAndDelete(id);
      res.json(deletedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteImagesProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await cloudinaryDeleteImg(`ecommerce-digitic/${id}`);
    res.json({ message: "Image deleted", result: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const addToWish = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    let user = await User.findById(_id);
    const alreadyadded = user.wishlist.find(
      (id) => id.toString() === prodId.toString()
    );
    console.log(alreadyadded);
    if (alreadyadded) {
      user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
    } else {
      user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
    }
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);

    let alreadyRated = product.ratings.find(
      (userID) => userID.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
      // res.json(updateRating)
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
      // res.json(rateProduct)
    }
    const getallRatings = await Product.findById(prodId);
    let totalrating = getallRatings.ratings.length;
    let ratingsum = getallRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalrating);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) =>
          cloudinaryDeleteImg(`ecommerce-digitic/${img.public_id}`)
        )
      );
    }
    
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const newpath = await cloudinaryUploadImg(file.buffer, "images");
      urls.push(newpath);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { images: urls },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});


module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWish,
  rating,
  uploadImages,
  deleteImagesProduct,
  getAllProductsWithMeta,
};
