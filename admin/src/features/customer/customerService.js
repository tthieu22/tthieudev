import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";
const getAllUser = async () => {
  const response = await axios.get(`${base_url}user/all-users`, config);

  return response.data;
};

const customerService = {
  getAllUser,
};

export default customerService;