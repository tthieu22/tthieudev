import axios from "axios"; 
import { getConfig, base_url } from "../../utils/axiosconfig";

// Function to get coupons
const getCoupon = async () => {
  try {
    const response = await axios.get(`${base_url}coupon`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error.response?.data || error;
  }
};
const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(`${base_url}coupon`, couponData, getConfig());
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
