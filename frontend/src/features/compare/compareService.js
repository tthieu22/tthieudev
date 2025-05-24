import axios from "axios";
import { base_url, getConfig} from "../../utils/axiosConfig";

const addToCompare = async (productId) => {
    try {
        const response = await axios.get(`${base_url}product/${productId}`, {}, getConfig());
        return response.data;
    } catch (error) {
        throw error.response && error.response.data
            ? error.response.data
            : error.message;
    }
};

export const cartService = {
    addToCompare,
};
