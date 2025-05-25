import axios from "axios";
import {  base_url , getConfig} from "../../utils/axiosconfig";

// Function to get users
const getEnquiry = async () => {
  try {
    const response = await axios.get(`${base_url}enquiry`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};
const deleteEnquiry = async (id) => {
  try {
    const response = await axios.delete(`${base_url}enquiry/${id}` , getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};

const updateEnquiry = async (data) => {
  try {
    const response = await axios.put(`${base_url}enquiry/${data.id}`, data, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
}
const enquiryService = {
  getEnquiry,
  deleteEnquiry,
  updateEnquiry
};

export default enquiryService;
