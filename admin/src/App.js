import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Forgotpassword from "./pages/Forgotpassword";
import Resetpassword from "./pages/Resetpassword"; 
import MainLayout from "./components/MainLayout";
import Enquiries from "./pages/Enquiries";
import Blog from "./pages/Blog";
import BlogCatList from "./pages/Blogcatlist";
import Orders from "./pages/Orders";
import Customers from "./pages/Cutomers";
import Colorlist from "./pages/Colorlist";
import Categorylist from "./pages/Categorylist";
import Brandlist from "./pages/Brandlist";
import Productlist from "./pages/Productlist";
import AddBlog from "./pages/AddBlog";
import Addblogcat from "./pages/Addblogcat";
import Addcolor from "./pages/Addcolor";
import Addcat from "./pages/Addcat";
import Addbrand from "./pages/Addbrand";
import Addproduct from "./pages/Addproduct";
import Coupon from "./pages/Coupon";
import AddCoupon from "./pages/AddCoupon";
import OrderDetail from "./pages/OrderDetail";
import EditCustomer from "./pages/EditCustomer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<Resetpassword />} />
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="blog-list" element={<Blog />} />
          <Route path="blog-category-list" element={<BlogCatList />} />
          <Route path="blog-category" element={<Addblogcat />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customer" element={<Customers />} />
          <Route path="list-color" element={<Colorlist />} />
          <Route path="color" element={<Addcolor />} />
          <Route path="list-category" element={<Categorylist />} />
          <Route path="list-brand" element={<Brandlist />} />
          <Route path="product-list" element={<Productlist />} />
          <Route path="category" element={<Addcat />} />
          <Route path="blog" element={<AddBlog />} />
          <Route path="brand" element={<Addbrand />} />
          <Route path="product" element={<Addproduct />} />
          <Route path="coupon" element={<AddCoupon />} />
          <Route path="coupon-list" element={<Coupon />} />
          <Route path="brand/:id" element={<Addbrand />} />
          <Route path="category/:id" element={<Addcat />} />
          <Route path="color/:id" element={<Addcolor />} />
          <Route path="product/:id" element={<Addproduct />} />
          <Route path="blog/:id" element={<AddBlog />} />
          <Route path="blog-category/:id" element={<Addblogcat />} />
          <Route path="admin-order-details/:orderCode" element={<OrderDetail />} />
          <Route path="customers/:id" element={<EditCustomer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
