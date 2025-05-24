import axios from "axios"; 
import { getConfig, base_url } from "../../utils/axiosconfig";

// Function to get users
const getBlog = async () => {
  try {
    const response = await axios.get(`${base_url}blog/get-all-blog`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
// Function to create a new blog post
const createBlog = async (blogData) => {
  try {
    const response = await axios.post(`${base_url}blog`, blogData, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
// Function to get a single blog post
const getaBlog = async (id) => {
  try {
    const response = await axios.get(`${base_url}blog/${id}`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
}

// Function to delete a blog post
const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${base_url}blog/${id}`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};

// Upload images for a blog post
const uploadImagesBlog = async (blogId, data) => {
  try {
    const response = await axios.put(`${base_url}blog/upload/${blogId}`, data, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error.response?.data || error;
  }
};

// Delete an image from blog post
const deleteImageBlog = async (public_id) => {
  try {
    const response = await axios.delete(
      `${base_url}blog/delete-img/${public_id}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error.response?.data || error;
  }
};
// Update a blog post
const updateaBlog = async (id, blogData) => {
  try {
    const response = await axios.put(`${base_url}blog/${id}`, blogData, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error.response?.data || error;
  }
};
const blogService = {
  getBlog,
  createBlog,
  deleteBlog,
  getaBlog,
  uploadImagesBlog,
  deleteImageBlog,
  updateaBlog,
};

export default blogService;
