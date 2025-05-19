import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/user/userSlice";
import productReducer from "../features/product/productSlice";
import blogReducer from "../features/blogs/blogSlice";
import contactReducer from "../features/contact/contactSlice";
import compareReducer from "../features/compare/compareSlice";
import orderReducer from "../features/order/orderSlice";
import chatbotReducer from "../features/chatbot/chatbotSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    product: productReducer,
    blog: blogReducer,
    contact: contactReducer,
    compare: compareReducer,
    order: orderReducer,
    chatbot: chatbotReducer,
  },
});
