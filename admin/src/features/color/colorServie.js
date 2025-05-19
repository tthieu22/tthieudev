import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

// Function to get users
const getColor = async () => {
  try {
    const response = await axios.get(`${base_url}color`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
const createColor = async (colorData) => {
  try {
    const response = await axios.post(`${base_url}color`, colorData, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};

const getaColor = async (id) => {
  try {
    const response = await axios.get(`${base_url}color/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || error;
  }
};
const updateColor = async (color) => {
  try {
    const response = await axios.put(
      `${base_url}color/${color.id}`,
      { title: color.colorData.title },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || error;
  }
};

const deleteaColor = async (id) => {
  try {
    const response = await axios.delete(`${base_url}color/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || error;
  }
};
const colorService = {
  getColor,
  createColor,
  getaColor,
  updateColor,
  deleteaColor,
};

export default colorService;
