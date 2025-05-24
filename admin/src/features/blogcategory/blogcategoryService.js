import axios from "axios"; 
import { getConfig, base_url } from "../../utils/axiosconfig";

// Function to get users
const getBlogCategory = async () => {
  try {
    const response = await axios.get(`${base_url}blog-category/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
const createBlogCategory = async (catData) => {
  try {
    const response = await axios.post(`${base_url}blog-category`, catData, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};

const deleteBlogCategory = async (id) => {
  try {
    const response = await axios.delete(`${base_url}blog-category/${id}`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
}
const getaBlogCategory = async (id) => {
  try {
    const response = await axios.get(`${base_url}blog-category/${id}`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
}
const updateBlogCategory = async (id, catData) => {
  try {
    const response = await axios.put(`${base_url}blog-category/${id}`, catData, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
}
const blogCategoryService = {
  getBlogCategory,
  createBlogCategory,
  deleteBlogCategory,
  getaBlogCategory,
  updateBlogCategory,
};

export default blogCategoryService;
