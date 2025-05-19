import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const uploadImg = async (data) => {
  const reponse = await axios.put(`${base_url}upload/`, data, config);
  return reponse.data;
};
const deleteImg = async (id) => {
  const reponse = await axios.delete(
    `${base_url}upload/delete-img/${id}`,
    config
  );
  return reponse.data;
};
const uploadService = {
  uploadImg,
  deleteImg,
};

export default uploadService;
