import axios from "axios"; 
import { getConfig, base_url } from "../../utils/axiosconfig";

const uploadImg = async (data) => {
  const reponse = await axios.put(`${base_url}upload/`, data, getConfig());
  return reponse.data;
};
const deleteImg = async (id) => {
  const reponse = await axios.delete(
    `${base_url}upload/delete-img/${id}`,
    getConfig()
  );
  return reponse.data;
};
const uploadService = {
  uploadImg,
  deleteImg,
};

export default uploadService;
