import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";
// Function to get users
const getBrand = async () => {
  try {
    const response = await axios.get(`${base_url}brand/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
const createBrand = async (brand) => {
  try {
    const response = await axios.post(`${base_url}brand`, brand, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
const getaBrand = async (id) => {
  try {
    const response = await axios.get(`${base_url}brand/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
const updateBrand = async (brand) => {
  try {
    const response = await axios.put(
      `${base_url}brand/${brand.id}`,
      { title: brand.brandData.title },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};

const deleteaBrand = async (id) => {
  try {
    const response = await axios.delete(`${base_url}brand/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
const brandService = {
  getBrand,
  createBrand,
  getaBrand,
  updateBrand,
  deleteaBrand,
};

export default brandService;
