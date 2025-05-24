const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdminCtrl,
  getWishList,
  saveAddress,
  getUserCart,
  emptyCart,
  createOrder,
  getOrder,
  updateOrderStatus,
  getAllOrder,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  applyCouponToCart,
  removeCouponFromCart,
  createVNPayUrl,
  vnpayReturn,
  createMomoUrl,
  momoIPN,
  cancelOrder,
  getUserOrders,
  getOrderById,
  getOrderByCode
} = require("../controller/userCtrl");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const router = express.Router();

router.post("/register", createUser);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdminCtrl);
router.post("/cart", authmiddleware, addToCart);
router.post("/forgot-password-token", forgotPasswordToken);

router.post("/cart/applycoupon", authmiddleware, applyCouponToCart);
router.post("/cart/cash-order", authmiddleware, createOrder);
router.get("/cart", authmiddleware, getUserCart);
router.put("/reset-password/:token", resetPassword);

router.get("/wish-list", authmiddleware, getWishList);
router.get("/all-users", authmiddleware, getallUser); 
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authmiddleware, isAdmin, getaUser);
router.delete("/empty-cart", authmiddleware, emptyCart);
router.delete("/delete-product-cart", authmiddleware, removeFromCart);
router.delete("/delete-coupon-cart", authmiddleware, removeCouponFromCart);
router.delete("/:id", deleteaUser);
router.put("/update-quantity-product", authmiddleware, updateCartItemQuantity);

router.put("/password", authmiddleware, updatePassword);
router.put("/edit-user", authmiddleware, updateaUser);
router.put("/save-address", authmiddleware, saveAddress);
router.put("/block-user/:id", authmiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authmiddleware, isAdmin, unblockUser);

router.put("/reset-password/:token", resetPassword);
 
router.post("/order/cod", authmiddleware, createOrder);
 
router.post("/order/create-vnpay-url", authmiddleware, createVNPayUrl);
router.get("/order/vnpay-return", vnpayReturn);
 
router.post("/order/create-momo-url", authmiddleware, createMomoUrl);
router.post("/order/momo-ipn", momoIPN);
 
router.post("/order/cancel", authmiddleware, cancelOrder);
 
router.put("/order/update-order/:orderId", authmiddleware, isAdmin, updateOrderStatus);

// Lấy tất cả đơn hàng của user
router.get("/order/user-orders", authmiddleware, getUserOrders);

// Lấy một đơn hàng gần nhất theo user
router.get("/order/get-order", authmiddleware, getOrder);

// Lấy tất cả đơn hàng (admin)
router.get("/order/get-all-order", authmiddleware, isAdmin, getAllOrder);

// Lấy đơn hàng theo ID
router.get("/order/:id", authmiddleware, getOrderById);  
router.get("/order/code/:code", authmiddleware, getOrderByCode);  
module.exports = router;
