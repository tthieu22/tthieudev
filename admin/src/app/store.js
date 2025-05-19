import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customer/customerSlice";
import productReducer from "../features/product/productClice";
import brandReducer from "../features/brand/brandClice";
import categoryReducer from "../features/category/categoryClice";
import colorReducer from "../features/color/colorClice";
import blogReducer from "../features/blog/blogClice";
import blogCategoryReducer from "../features/blogcategory/blogcategoryClice";
import enquiriesReducer from "../features/enquiries/enquiriesClice";
import uploadRecducer from "../features/upload/uploadClice";
import couponReducer from "../features/coupon/couponSlice";
import orderReducer from "../features/order/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    product: productReducer,
    brand: brandReducer,
    category: categoryReducer,
    color: colorReducer,
    blog: blogReducer,
    blogcategory: blogCategoryReducer,
    enquiry: enquiriesReducer,
    upload: uploadRecducer,
    coupon: couponReducer,
    order: orderReducer,
  },
});
