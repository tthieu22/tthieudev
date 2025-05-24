import axios from "axios";
import { base_url,getConfig } from "../../utils/axiosConfig";

const postQuery = async (contactData) => {
  try {
    const response = await axios.get(`${base_url}contact/`,(contactData), getConfig());
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};

export const contactService = {
  postQuery,
};
