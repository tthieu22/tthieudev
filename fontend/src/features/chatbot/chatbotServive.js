import axios from "axios";
import { base_url } from "../../utils/axiosConfig";

const sendMessage = async (userInput) => {
  try {
    const response = await axios.post(`${base_url}product/chat`, { userInput });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const chatbotService = {
  sendMessage,
};
