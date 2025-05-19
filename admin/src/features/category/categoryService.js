import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

// Function to get categories
const getCategories = async () => {
  try {
    const response = await axios.get(`${base_url}category`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || error;
  }
};
const createCategory = async (catData) => {
  try {
    const response = await axios.post(`${base_url}category`, catData, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || error;
  }
};

const getaCategory = async (id) => {
  try {
    const response = await axios.get(`${base_url}category/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || error;
  }
};
const updateCategory = async (category) => {
  try {
    const response = await axios.put(
      `${base_url}category/${category.id}`,
      { title: category.categoryData.title },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || error;
  }
};

const deleteaCategory = async (id) => {
  try {
    const response = await axios.delete(`${base_url}category/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || error;
  }
};
const categoryService = {
  getCategories,
  createCategory,
  getaCategory,
  updateCategory,
  deleteaCategory,
};

export default categoryService;
