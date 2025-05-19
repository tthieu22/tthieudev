import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getOrderDetail = async () => {
    try {
        const response = await axios.get(`${base_url}order/get-order-detail`, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${base_url}user/order/cod`, orderData, config);
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
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getOrderNew = async () => {
    try {
        const response = await axios.get(`${base_url}order/get-order-new`, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const cancelOrder = async (orderId) => {
    try {
        const response = await axios.delete(`${base_url}order/cancel-order/${orderId}`, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
const getOrderByCode = async (orderCode) => {
    try {
        const response = await axios.get(`${base_url}user/order/code/${orderCode}`, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.put(`${base_url}user/order/update-order/${orderId}`, { status }, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
export const orderService = { getOrderDetail, createOrder, getOrderNew , cancelOrder, createVNPayUrl,getOrderByCode,updateOrderStatus};