const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const Color = require("../models/colorModel");
const uniqid = require("uniqid");
const { generateToken } = require("../config/jwtToken");
const asyncHandler = require("express-async-handler");
const { validateMongodbId } = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailCtrl");
const crypto = require("crypto");
const vnpay = require("../config/VNPayConfig");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const MomoConfig = require('../config/momoConfig');
require("dotenv").config({ path: "../.env" });


const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //create user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});
//login
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else { 
    res.json({  
      message: "Error",
    });
  }
});

const loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//handle refreshToken
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token person in db of not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findByIdAndUpdate(user._id, {
    // await User.findByIdAndUpdate(, refreshToken{
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});
// update a user
const updateaUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    const { firstname, lastname, email, mobile } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    const emailExists = await User.findOne({ email, _id: { $ne: _id } });
    if (emailExists) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const mobileExists = await User.findOne({ mobile, _id: { $ne: _id } });
    if (mobileExists) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});


// save user address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const updateaUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updateaUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get All user
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json(getaUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json(deleteaUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(block);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblock);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

//forgot password token
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Không tìm thấy người dùng với email này");

  try {
    const resetToken = await user.createPasswordResetToken(); // tạo token
    await user.save();

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`; // frontend URL
    const data = {
      to: email,
      text: "Hey User",
      subject: "Liên kết đặt lại mật khẩu",
      htm: `<p>Chào bạn,</p><p>Nhấp vào liên kết để đặt lại mật khẩu: <a href="${resetURL}">Tại đây</a></p><p>Liên kết này chỉ có hiệu lực trong 10 phút.</p>`,
    };

    await sendEmail(data);
    res.json({ success: true, message: "Đã gửi email đặt lại mật khẩu" });
  } catch (error) {
    throw new Error("Gửi email thất bại: " + error.message);
  }
});

//reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Token đã hết hạn hoặc không hợp lệ. Vui lòng thử lại");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  res.json({ success: true, message: "Mật khẩu đã được cập nhật thành công" });
});

const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");

    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get user cart
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);

  const cart = await Cart.findOne({ user: _id })
    .populate("items.product")
    .populate("items.color")
    .populate("coupon");

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  let cartTotal = 0;
  cart.items.forEach(item => {
    cartTotal += item.price * item.quantity;
  });

  cart.cartTotal = cartTotal;
  cart.totalAfterDiscount = cart.discount
    ? cartTotal - (cartTotal * cart.discount) / 100
    : cartTotal;

  await cart.save();

  res.json(cart);
});

// Add to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, colorId } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  const userId = _id;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  let color = null;
  if (colorId) {
    color = await Color.findById(colorId);
    if (!color) {
      res.status(400);
      throw new Error("Color not found");
    }
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.color.toString() === (color ? color._id.toString() : null)
  );

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      color: color ? color._id : null,
      price: product.price,
    });
  }

  cart.cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  await cart.save();

  res.json({
    message: "Product added to cart successfully",
    cart,
  });
});
// Xóa 1 sản phẩm trong giỏ hàng
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, colorId } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  const userId = _id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    res.status(400);
    throw new Error("Cart not found");
  }

  const index = cart.items.findIndex((item) => {
    const isSameProduct = item.product.toString() === productId;
    const isSameColor =
      (colorId && item.color && item.color.toString() === colorId) ||
      (!colorId && !item.color);
    return isSameProduct && isSameColor;
  });

  if (index === -1) {
    res.status(400);
    throw new Error("Product not found in cart");
  }

  cart.items.splice(index, 1);
  cart.cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  await cart.save();

  res.json({
    message: "Product removed from cart successfully",
    cart,
  });
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId, colorId, quantity } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);

  const cart = await Cart.findOne({ user: _id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const index = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.color?.toString() === (colorId || null)
  );

  if (index === -1) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  if (quantity < 1) {
    cart.items.splice(index, 1);
  } else {
    cart.items[index].quantity = quantity;
  }

  cart.cartTotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  res.json({
    message: "Cart updated successfully",
    cart,
  });
});
// Xóa giỏ hàng
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);

  const cart = await Cart.findOne({ user: _id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = [];
  cart.cartTotal = 0;
  cart.totalAfterDiscount = 0;
  cart.discount = 0;
  cart.coupon = null;

  await cart.save();

  res.json({
    message: "Cart cleared successfully",
    cart,
  });
});

// Áp mã giảm giá 
const applyCouponToCart = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);

  const coupon = await Coupon.findOne({
    name: couponCode,
    expiry: { $gt: new Date() },
    // isActive: true,
  });

  if (!coupon) {
    res.status(400);
    throw new Error("Invalid or expired coupon");
  }

  const cart = await Cart.findOne({ user: _id });
  if (!cart) {
    res.status(400);
    throw new Error("Cart not found");
  }

  cart.coupon = coupon._id;
  cart.discount = coupon.discount;
  cart.totalAfterDiscount = Math.round(cart.cartTotal * (1 - coupon.discount / 100));

  await cart.save();

  res.json({
    message: "Coupon applied successfully",
    cart,
  });
});
// Xóa mã giảm giá khỏi giỏ hàng
const removeCouponFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);

  const cart = await Cart.findOne({ user: _id });
  if (!cart) {
    res.status(400);
    throw new Error("Cart not found");
  }

  cart.coupon = null;
  cart.discount = 0;
  cart.totalAfterDiscount = 0;

  await cart.save();

  res.json({
    message: "Coupon removed from cart successfully",
    cart,
  });
});

// Get list order user (admin)
const getUserOrders = asyncHandler(async (req, res) => { 
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const orders = await Order.find({ orderBy: _id })
      .populate("products.product")
      .populate("products.color")
      .populate("orderBy")
      .populate("coupon");

    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

// Get order details by id (anywhere)
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const order = await Order.findById(id)
      .populate("products.product")
      .populate("products.color")
      .populate("orderBy")
      .populate("coupon");

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
    }

    res.json(order);
  } catch (error) {
    throw new Error(error);
  }
});
// bycode
const getOrderByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;
  try {
    const order = await Order.findOne({ orderCode: code })
      .populate("products.product")
      .populate("products.color")
      .populate("orderBy")
      .populate("coupon");

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  try {
    validateMongodbId(req.user._id);
    validateMongodbId(orderId);

    const updateFields = {
      orderStatus: status,
    };

    if (status === "Completed" || status === "Delivered") {
      updateFields.paymentStatus = "Paid";
    }

    if (status === "Cancelled" || status === "Failed" || status === "Refunded") {
      updateFields.paymentStatus = "Failed";
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true }
    )
      .populate("products.product")
      .populate("orderBy")
      .populate("coupon");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Gửi email sau khi cập nhật thành công
    const customer = updatedOrder.orderBy;
    const email = customer.email;
    const fullName = `${customer.firstname || ""} ${customer.lastname || ""}`.trim();
    const orderCode = updatedOrder.orderCode || updatedOrder._id;
    const updatedAt = new Date().toLocaleString("vi-VN");

    const emailData = {
      to: email,
      subject: `Cập nhật trạng thái đơn hàng #${orderCode}`,
      text: `Đơn hàng của bạn đã được cập nhật trạng thái: ${status}`,
      htm: `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
          <h2>Xin chào ${fullName || "quý khách"},</h2>
          <p>Đơn hàng <strong>#${orderCode}</strong> của bạn vừa được cập nhật trạng thái:</p>

          <table style="border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">Trạng thái mới:</td>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>${status}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">Thời gian cập nhật:</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${updatedAt}</td>
            </tr>
          </table>

          <p style="margin-top: 15px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận hỗ trợ khách hàng.</p>

          <p>Trân trọng,<br><strong>Đội ngũ chăm sóc khách hàng</strong></p>
          <hr style="margin-top: 20px;" />
          <p style="font-size: 13px; color: #888;">Đây là email tự động. Vui lòng không trả lời email này.</p>
        </div>
      `,
    };

    // await sendEmail(emailData);

    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng và gửi email thành công",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Lấy đơn hàng của người dùng
const getOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongodbId(userId);

  try {
    const order = await Order.findOne({ orderBy: userId })
      .populate("products.product")
      .populate("products.color")
      .populate("orderBy")
      .populate("coupon");
      
    res.json(order);
  } catch (error) {
    throw new Error(error);
  }
});


// Lấy tất cả đơn hàng
const getAllOrder = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product")
      .populate("products.color")
      .populate("orderBy")
      .populate("coupon");

    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});
// Tạo đơn hàng
const createOrder = asyncHandler(async (req, res) => {
  const { paymentMethod, couponApplied, shippingAddress } = req.body;
  const userId = req.user._id;

  try {
    if (!paymentMethod) throw new Error("Thiếu phương thức thanh toán");

    const user = await User.findById(userId);
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart || !userCart.items || userCart.items.length === 0) {
      throw new Error("Giỏ hàng trống");
    }

    const finalAmount = couponApplied && userCart.totalAfterDiscount
      ? userCart.totalAfterDiscount
      : userCart.cartTotal;

    const orderProducts = userCart.items.map(item => ({
      product: item.product,
      count: item.quantity,
      color: item.color,
      price: item.price
    }));

    const newOrder = await Order.create({
      orderCode: `ORD${Date.now()}`,
      products: orderProducts,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      paymentDetails: {
        transactionId: uniqid(),
        payDate: new Date(),
        bankCode: paymentMethod !== "COD" ? "" : undefined,
        responseCode: paymentMethod !== "COD" ? "00" : undefined
      },
      shippingAddress,
      totalAmount: userCart.cartTotal,
      totalAfterDiscount: couponApplied ? userCart.totalAfterDiscount : undefined,
      coupon: couponApplied ? userCart.coupon : null,
      orderBy: userId,
      orderStatus: paymentMethod === "COD" ? "Not Processed" : "Processing"
    });

    // Cập nhật tồn kho
    const bulkUpdate = orderProducts.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: {
            quantity: -item.count,
            sold: +item.count
          }
        }
      }
    }));
    await Product.bulkWrite(bulkUpdate);

    // Gửi email xác nhận đơn hàng
    const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();
    const email = user.email;
    const createdAt = newOrder.createdAt.toLocaleString("vi-VN");

    const productDetailsHtml = orderProducts.map(p => `
      <li>
        Sản phẩm: <strong>${p.product.title || "Tên sản phẩm"}</strong><br/>
        Số lượng: ${p.count} - Màu: ${p.color}<br/>
        Giá: ${p.price.toLocaleString()}đ
      </li>
    `).join("");

    const emailData = {
      to: email,
      subject: `Xác nhận đơn hàng #${newOrder.orderCode}`,
      text: `Đơn hàng của bạn đã được đặt thành công.`,
      htm: `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
          <h2>Xin chào ${fullName},</h2>
          <p>Bạn đã đặt thành công đơn hàng <strong>#${newOrder.orderCode}</strong> vào lúc ${createdAt}.</p>
          
          <h3>Thông tin đơn hàng:</h3>
          <ul>${productDetailsHtml}</ul>

          <p><strong>Tổng thanh toán:</strong> ${finalAmount.toLocaleString()}đ</p>
          <p><strong>Phương thức thanh toán:</strong> ${paymentMethod}</p>
          <p><strong>Địa chỉ giao hàng:</strong> ${shippingAddress}</p>

          <p style="margin-top: 15px;">Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.</p>

          <p>Trân trọng,<br><strong>Đội ngũ hỗ trợ khách hàng</strong></p>
          <hr style="margin-top: 20px;" />
          <p style="font-size: 13px; color: #888;">Đây là email tự động. Vui lòng không trả lời email này.</p>
        </div>
      `
    };

    // await sendEmail(emailData);

    res.json({
      success: true,
      message: "Tạo đơn hàng thành công",
      order: newOrder,
      orderCode: newOrder.orderCode
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Tạo URL thanh toán VNPay
const createVNPayUrl = asyncHandler(async (req, res) => {
  const { orderCode, amount, orderInfo } = req.body;
  if (!orderCode || !amount || !orderInfo) {
    return res.status(400).json({ message: "Thieu tham so" });
  }
  const paymentUrl = await vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: req.ip === "::1" ? "127.0.0.1" : req.ip,
    vnp_TxnRef: orderCode,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL ,
    vnp_Locale: "vn",
    vnp_CreateDate: moment().format("YYYYMMDDHHmmss"),
    vnp_ExpireDate: moment().add(5, "m").format("YYYYMMDDHHmmss"),
  });

  res.json({ success: true, paymentUrl });
});

// Callback VNPay
const vnpayReturn = asyncHandler(async (req, res) => {
  const query = req.query;
  const isValid = vnpay.verifyReturnUrl(query);

  if (!isValid) {
    return res.status(400).json({ message: "Invalid VNPay signature" });
  }

  if (query.vnp_ResponseCode === "00") {
    const orderCode = query.vnp_TxnRef; // sử dụng orderCode
    const amount = parseInt(query.vnp_Amount, 10) / 100;

    // Tìm đơn hàng bằng orderCode
    const order = await Order.findOne({ orderCode });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (amount !== order.totalAmount) {
      return res.status(400).json({ message: "Amount mismatch" });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.paymentDetails = {
      transactionId: query.vnp_TransactionNo,
      payDate: new Date(),
      bankCode: query.vnp_BankCode || "",
      responseCode: "00",
    };
    await order.save();

    return res.send(`
      <html><body>
        <script>
          window.opener.postMessage({ status: 'success', orderCode: '${orderCode}' }, '*');
          window.close();
        </script>
        <p>Thanh toán thành công! Đang đóng...</p>
      </body></html>
    `);    
  } else {
    return res.send(`
      <html><body>
        <script>
          window.opener.postMessage({ status: 'fail' }, '*');
          window.close();
        </script>
        <p>Thanh toán thất bại! Đang đóng...</p>
      </body></html>
    `);    
  }
});


// Tạo URL thanh toán Momo
const createMomoUrl = asyncHandler(async (req, res) => {
  const { amount, orderInfo } = req.body;
  const requestId = uuidv4();
  const orderId = uuidv4();

  const rawSignature = `accessKey=${MomoConfig.accessKey}&amount=${amount}&extraData=&ipnUrl=${MomoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MomoConfig.partnerCode}&redirectUrl=${MomoConfig.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

  const signature = crypto.createHmac("sha256", MomoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode: MomoConfig.partnerCode,
    accessKey: MomoConfig.accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: MomoConfig.redirectUrl,
    ipnUrl: MomoConfig.ipnUrl,
    extraData: "",
    requestType: "captureWallet",
    signature,
    lang: "vi"
  };

  const response = await axios.post(MomoConfig.endpoint, body, {
    headers: { "Content-Type": "application/json" }
  });

  res.json({ success: true, paymentUrl: response.data.payUrl });
});

// Xử lý callback từ Momo
const momoIPN = asyncHandler(async (req, res) => {
  const data = req.body;
  const { resultCode, orderId, transactionId, bankCode } = data;

  const order = await Order.findById(orderId);
  
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  } 
  if (resultCode === 0) {
    await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "Paid",
        orderStatus: "Confirmed", 
        "paymentDetails.transactionId": transactionId, 
        "paymentDetails.bankCode": bankCode, 
        "paymentDetails.payDate": new Date(),
        "paymentDetails.responseCode": "00",
      },
      { new: true } 
    );
    res.status(200).json({ message: "Momo payment success" });
  } else {
    res.status(400).json({ message: "Payment failed" });
  }
});
// Hủy đơn hàng
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Đơn hàng không tồn tại" });
  }

  if (order.paymentStatus === "Paid") {
    return res.status(400).json({ message: "Không thể hủy đơn hàng đã thanh toán" });
  }

  order.orderStatus = "Canceled";
  await order.save();

  res.json({ success: true, message: "Đơn hàng đã được hủy" });
});
module.exports = {
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
};
