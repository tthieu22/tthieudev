import axios from "axios"; 
import { getConfig, base_url } from "../../utils/axiosconfig";
const getAllUser = async () => {
  const response = await axios.get(`${base_url}user/all-users`, getConfig());

  return response.data;
};

const customerService = {
  getAllUser,
};

export default customerService;