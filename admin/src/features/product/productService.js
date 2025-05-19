import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

// Function to get all products
const getProducts = async () => {
  try {
    const response = await axios.get(`${base_url}product`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response?.data || error;
  }
};
// Function to create a new product
const createProduct = async (product) => {
  try {
    const response = await axios.post(`${base_url}product`, product, config);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error.response?.data || error;
  }
};

// Upload images for a product
const uploadImagesProduct = async (productId, formData) => {
  try {
    const response = await axios.put( `${base_url}product/upload/${productId}`,formData, config );
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error.response?.data || error;
  }
};

// Delete an image from product
const deleteImageProduct = async (public_id) => {
  try {
    const response = await axios.delete(
      `${base_url}product/delete-img/${public_id}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error.response?.data || error;
  }
};

// Get a single product
const getaProduct = async (id) => {
  try {
    const response = await axios.get(`${base_url}product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error.response?.data || error;
  }
};

// Update a product
const updateProduct = async (id, product) => {  
  try {
    const response = await axios.put(`${base_url}product/${id}`, product, config);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error.response?.data || error;
  }
};

// Delete a product
const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${base_url}product/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error.response?.data || error;
  }
};

const productService = {
  getProducts,
  createProduct,
  uploadImagesProduct,
  deleteImageProduct,
  getaProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
