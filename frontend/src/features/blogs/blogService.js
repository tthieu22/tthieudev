import axios from "axios";
import { base_url } from "../../utils/axiosConfig";

const getBlogs = async () => {
  try {
    const response = await axios.get(`${base_url}blog/get-all-blog`);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};

const getBlog = async (id) => {
  try {
    const response = await axios.get(`${base_url}blog/${id}`);
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};
export const blogService = {
  getBlogs,
  getBlog,
};
