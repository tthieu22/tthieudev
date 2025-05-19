const Blog = require("../models/blogModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { validateMongodbId } = require("../utils/validateMongodbId");
const { cloudinaryUploadImg,cloudinaryDeleteImg } = require("../utils/cloudinary");
const fs = require("fs")
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(updateBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})
const getaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const getaBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 }
            },
            { new: true })

        res.json(getaBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getAllBlog = await Blog.find();
        res.json(getAllBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
  
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      if (blog.images.length > 0) {
        for (let i = 0; i < blog.images.length; i++) {
          await cloudinaryDeleteImg(`ecommerce-digitic/${blog.images[i].public_id}`);
        }
      }
  
      const deletedBlog = await Blog.findByIdAndDelete(id);
      return res.json(deletedBlog);
  
    } catch (error) {
      throw new Error(error);
    }
});

const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId)
    //find the blog you want to be like
    const blog = await Blog.findById(blogId)
    //find the login user
    const loginUserId = req?.user?._id;
    console.log(loginUserId);
    //find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisLiked = blog?.dislikes?.find((userId => userId?.toString() === loginUserId?.toString()))
    if (alreadyDisLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, { new: true });
        res.json(blog)
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, { new: true });
        res.json(blog)
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, { new: true });
        res.json(blog)
    }
})
//**dislike */
const disLikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId)
    const blog = await Blog.findById(blogId)
    const loginUserId = req?.user?._id;
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find(userId => userId.toString() === loginUserId.toString())
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, { new: true });
        res.json(blog)
    }
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, { new: true });
        res.json(blog)
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true
        }, { new: true });
        res.json(blog)
    }
})
const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.images && blog.images.length > 0) {
      await Promise.all(
        blog.images.map((img) =>
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

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { images: urls },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});
  
const deleteImagesBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const deleted = await cloudinaryDeleteImg(`ecommerce-digitic/${id}`);
    res.json({ message: "Image deleted", result: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { createBlog, updateBlog, getaBlog, getAllBlog, deleteBlog, likeBlog, disLikeBlog, uploadImages, deleteImagesBlogs }   