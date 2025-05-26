import axios from "axios";
import { base_url, getConfig } from "../../utils/axiosConfig";

const getProducts = async ({ limit }) => {
  try {
    const response = await axios.get(`${base_url}product/`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};

const addToWishlist = async (prodId) => {
  try {
    const response = await axios.put(
      `${base_url}product/wishlist/`,
      {prodId},
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};
const getAproduct = async (prodId) => {
  try {
    const response = await axios.get(`${base_url}product/${prodId}/`);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};
const getColor = async () => {
  try {
    const response = await axios.get(`${base_url}color`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
const getProductsWithMeta = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await axios.get(`${base_url}product/infinite?${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const rating = async (data) => {
  try {
    const response = await axios.put(`${base_url}product/ratings`, data, getConfig());
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
}
const getAllCateogoryProduct = async () => {
  try {
    const response = await axios.get(`${base_url}category`);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
}
export const productService = {
  getProducts,
  addToWishlist,
  getAproduct,
  getColor,
  getProductsWithMeta,
  rating,
  getAllCateogoryProduct
};
