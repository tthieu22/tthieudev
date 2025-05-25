import { configureStore } from "@reduxjs/toolkit"; 
import authReducer from "../features/user/userSlice";
import productReducer from "../features/product/productSlice";
import blogReducer from "../features/blogs/blogSlice";
import contactReducer from "../features/contact/contactSlice";
import compareReducer from "../features/compare/compareSlice";
import orderReducer from "../features/order/orderSlice";
import chatbotReducer from "../features/chatbot/chatbotSlice";
import enquiryReducer from "../features/enquirry/enquirySlice";

export const store = configureStore({
  reducer: { 
    auth: authReducer,
    product: productReducer,
    blog: blogReducer,
    contact: contactReducer,
    compare: compareReducer,
    order: orderReducer,
    chatbot: chatbotReducer,
    enquiry: enquiryReducer
  },
});
