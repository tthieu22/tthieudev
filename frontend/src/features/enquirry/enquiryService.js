import axios from "axios";
import { base_url, getConfig } from "../../utils/axiosConfig";

const createEnquiry = async ({ name, email, mobile, comment }) => {
  try {
    const response = await axios.post(`${base_url}enquiry`, { name, email, mobile, comment }, getConfig());
    return response.data;
  } catch (error) { 
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

const enquiryService = { createEnquiry };
export default enquiryService;
