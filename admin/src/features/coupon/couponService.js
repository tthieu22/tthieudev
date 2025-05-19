import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

// Function to get coupons
const getCoupon = async () => {
  try {
    const response = await axios.get(`${base_url}coupon`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error.response?.data || error;
  }
};
const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(`${base_url}coupon`, couponData, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error.response?.data || error;
  }
};
const couponService = {
  getCoupon,
  createCoupon,
};

export default couponService;
