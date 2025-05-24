import axios from "axios";
import { base_url, getConfig } from "../../utils/axiosConfig";

const getOrderDetail = async () => {
    try {
        const response = await axios.get(`${base_url}order/get-order-detail`, getConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${base_url}user/order/cod`, orderData, getConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Tạo URL thanh toán VNPay
const createVNPayUrl = async ({ orderCode, amount, orderInfo }) => {
    try {
        const response = await axios.post(
            `${base_url}user/order/create-vnpay-url`,
            { orderCode, amount, orderInfo },
            getConfig()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getOrderNew = async () => {
    try {
        const response = await axios.get(`${base_url}order/get-order-new`, getConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const cancelOrder = async (orderId) => {
    try {
        const response = await axios.post(`${base_url}user/order/cancel`,{orderId}, getConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
const getOrderByCode = async (orderCode) => {
    try {
        const response = await axios.get(`${base_url}user/order/code/${orderCode}`, getConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
const getAllOrder = async ({ page, limit, search, status }) => {
    try {
      const response = await axios.get(`${base_url}user/order/user-orders`, {
        params: { page, limit, search, status },
        ...getConfig()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
export const orderService = { getOrderDetail, createOrder, getOrderNew , cancelOrder, createVNPayUrl,getOrderByCode ,getAllOrder};