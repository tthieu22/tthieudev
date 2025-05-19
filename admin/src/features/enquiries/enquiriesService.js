import axios from "axios";
import { base_url } from "../../utils/base_url";

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

const enquiryService = {
  getEnquiry,
};

export default enquiryService;
