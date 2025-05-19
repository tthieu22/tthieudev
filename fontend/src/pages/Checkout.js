import React, { useState, useEffect, useMemo } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link ,useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "../components/Container";
import { getCartUser , applyCoupon, resetStatus , emptyCart } from "../features/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createOrder,  payVnPay} from "../features/order/orderSlice";
const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadCart, setLoadCart] = useState(true);
  const [apllyCoupon, setApplyCoupon] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [loadCheckout,setLoadCheckout] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const getCart = useSelector((state) => state.auth.getCart);
  const items = useMemo(() => Array.isArray(getCart?.items) ? getCart.items : [], [getCart?.items]);

  const cartTotal = getCart?.cartTotal || 0;
  const totalAfterDiscount = getCart?.totalAfterDiscount || cartTotal;

  const { isSuccess, isError, isApplyCoupon } = useSelector((state) => state.auth);
  useEffect(() => {
    if (loadCheckout) {
      const timer = setTimeout(() => {
        if (items.length === 0) { 
          toast.error("Không có sản phẩm trong giỏ hàng");
          navigate("/cart");
        }
        setLoadCheckout(false);
      }, 500);
  
      return () => clearTimeout(timer);
    }
  }, [items, navigate, loadCheckout]);

  // Select payment method
  const [selectedMethod, setSelectedMethod] = useState(null);
  

  // Apply coupon
  const handleApplyCoupon = () => {
    if(coupon !== "") {
      dispatch(applyCoupon(coupon));
      setLoadCart(true);
      setApplyCoupon(true);
      dispatch(resetStatus());
    } else {
      toast.info("Vui lòng nhập mã giảm giá");
      setShowCoupon(false);
    }
  }

  // Toast 
  useEffect(() => {
    if (isSuccess && isApplyCoupon) {
      toast.success("Coupon applied successfully");
      setShowCoupon(true);
    }
    if (isError && apllyCoupon) {
      toast.error("Coupon not applied");
      setShowCoupon(false);
    }
    
  }, [isSuccess, isError, isApplyCoupon, apllyCoupon, dispatch]);
  
  // Load cart 
  useEffect(() => {
    if (loadCart) {
      dispatch(getCartUser());
      setLoadCart(false);
    }
  }, [dispatch, loadCart]);

  // Form
  const userData = JSON.parse(localStorage.getItem("customer")) || {};
  const formik = useFormik({
    initialValues: {
      fullName: userData.firstname && userData.lastname ? `${userData.firstname} ${userData.lastname}` : "",
      phone: userData.mobile || "",
      email: userData.email || "",
      address: "",
      district: "",
      city: "",
      postalCode: "",
      country: "",
      orderNote: "",
      couponCode: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      phone: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      address: Yup.string().required("Required"),
      district: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      postalCode: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      if (!paymentMethod) {
        toast.warn("Please select a payment method");
        return;
      }
    
      if (paymentMethod === "online" && !selectedMethod) {
        toast.warn("Please select an online payment method");
        return;
      }
    
      const checkoutData = {
        paymentMethod:
          paymentMethod === "cod"
            ? "COD"
            : selectedMethod === "vnpay"
            ? "VNPay"
            : selectedMethod === "momo"
            ? "Momo"
            : "",
        couponApplied: coupon !== "",
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          district: values.district,
          city: values.city,
          postalCode: values.postalCode,
          country: values.country,
        },
        cartItems: items,
        totalPrice: totalAfterDiscount,
      };
    
      if (paymentMethod === "cod") {
        const orderResult = await dispatch(createOrder(checkoutData)).unwrap();
        const orderCode = orderResult.orderCode;
        toast.success("Đặt hàng thành công - Thanh toán khi nhận hàng");
        dispatch(emptyCart());
        dispatch(resetStatus());
        navigate("/order-complete/" + orderCode);
      } else if (paymentMethod === "online") {
        try {
          const orderResult = await dispatch(createOrder(checkoutData)).unwrap();
          const orderCode = orderResult.orderCode;
          const totalAmount = orderResult.order.totalAmount;
          if (!orderCode || !totalAmount) return;
          toast.success("Đặt hàng thành công - Đang chờ thanh toán");
          if (selectedMethod === "vnpay") {
            const vnpayResult = await dispatch(
              payVnPay({
                orderCode: orderCode,
                amount: totalAmount,
                orderInfo: "vnpaytthieudev",
              })
            ).unwrap();
    
            if (vnpayResult?.paymentUrl) {
              openPaymentPopup(vnpayResult.paymentUrl);
            } else {
              toast.error("Không thể tạo URL thanh toán VNPay");
            }
          } else if (selectedMethod === "momo") {
            toast.info("Momo payment not implemented yet.");
          }
        } catch (error) {
          if (!showPaymentPopup) 
          toast.error(error?.message || "Đã xảy ra lỗi khi thanh toán");
        }
      }
    }    
    
  });

  // VNPay
  useEffect(() => {
    function handleMessage(event) { 
      const { status, message, orderCode } = event.data || {};
      if(!orderCode) return;
      if (status === "success") {
        toast.success("Thanh toán thành công");
        dispatch(emptyCart());
        dispatch(resetStatus());
      } else if (status === "fail") {
        toast.error(message || "Thanh toán thất bại");
      }
      navigate("/order-complete/" + orderCode); 
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, dispatch]);


  // Show payment popup
  const openPaymentPopup = (url, name = "VNPay Payment", width = 600, height = 700) => {
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      name,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    if (!popup) {
      return null;
    }
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
      }
    }, 500);
    return popup;
  };
  

  return (
    <Container class1="checkout-wrapper home-wrapper-2 py-5">
      <div className="row">
        {/* Left */}
        <div className="col-lg-7 col-md-12 mb-4">
          <div className="checkout-left-data bg-white p-4 rounded shadow-sm">
            <h3 className="websitename mb-3 text-primary">tthieu.dev.02</h3>

            <nav style={{ "--bs-breadcrumb-divider": ">" }} aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/cart" className="text-decoration-none text-dark">Cart &frasl;</Link>
                </li>
                <li className="breadcrumb-item active text-muted">Information &gt;</li>
                <li className="breadcrumb-item text-muted">Shipping &gt;</li>
                <li className="breadcrumb-item text-muted">Payment</li>
              </ol>
            </nav>

            <h4 className="title mb-3">Contact Information</h4>
            <p className="user-detail fw-bold text-dark mb-4">
              {userData.firstname} {userData.lastname} ({userData.email})
            </p>

            <h4 className="mb-3">Shipping Address</h4>
            <form onSubmit={formik.handleSubmit} className="row g-3">
              {/* Country */}
              <div className="col-12">
                <select
                  name="country"
                  className="form-control form-select border border-secondary-subtle rounded shadow-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                >
                  <option value="" disabled>Select Country</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="USA">USA</option>
                </select>
                {formik.touched.country && formik.errors.country && (
                  <div className="text-danger mt-1">{formik.errors.country}</div>
                )}
              </div>

              {/* Full Name */}
              <div className="col-12">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="form-control border rounded shadow-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullName}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-danger mt-1">{formik.errors.fullName}</div>
                )}
              </div>

              {/* Phone */}
              <div className="col-12">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="form-control border rounded shadow-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-danger mt-1">{formik.errors.phone}</div>
                )}
              </div>

              {/* Address */}
              <div className="col-12">
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  className="form-control border rounded shadow-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="text-danger mt-1">{formik.errors.address}</div>
                )}
              </div>

              {/* District */}
              <div className="col-md-6">
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  className="form-control border rounded shadow-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.district}
                />
                {formik.touched.district && formik.errors.district && (
                  <div className="text-danger mt-1">{formik.errors.district}</div>
                )}
              </div>

              {/* City */}
              <div className="col-md-6">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="form-control border rounded shadow-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="text-danger mt-1">{formik.errors.city}</div>
                )}
              </div>

              {/* Postal Code */}
              <div className="col-12">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  className="form-control border rounded shadow-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.postalCode}
                />
                {formik.touched.postalCode && formik.errors.postalCode && (
                  <div className="text-danger mt-1">{formik.errors.postalCode}</div>
                )}
              </div>
              {/* Payment Method */}  
              <div className="col-12 mt-3 payment-method-container">
                <label className="form-label fw-semibold mb-3 payment-method-label">Select Payment Method</label>

                <div className="form-check payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="paymentOnline"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setShowPaymentPopup(false);
                      setSelectedMethod(null);
                    }}
                  />
                  <label className="form-check-label ms-2" htmlFor="paymentOnline">
                    Online Payment
                  </label>
                </div>

                <div className="form-check mt-2 payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="paymentCOD"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setShowPaymentPopup(false);
                      setSelectedMethod(null);
                    }}
                  />
                  <label className="form-check-label ms-2" htmlFor="paymentCOD">
                    Cash on Delivery
                  </label>
                </div>

                {/* Show online payment options */}
                {paymentMethod === "online" && (
                  <div className="payment-method-details mt-4 ps-3 border-start border-3 border-primary payment-online-details">
                    <label className="form-label fw-semibold mb-2 online-method-label">Choose Online Payment Method:</label>

                    <div className="form-check online-method-option">
                      <input
  
                        type="radio"
                        name="onlineMethod"
                        id="vnpay"
                        value="vnpay"
                        checked={selectedMethod === "vnpay"}
                        onChange={() => setSelectedMethod("vnpay")}
                      />
                      <label className="form-check-label ms-2" htmlFor="vnpay">
                        VNPay
                      </label>
                    </div>

                    <div className="form-check mt-2 online-method-option">
                      <input
  
                        type="radio"
                        name="onlineMethod"
                        id="momo"
                        value="momo"
                        checked={selectedMethod === "momo"}
                        onChange={() => setSelectedMethod("momo")}
                      />
                      <label className="form-check-label ms-2" htmlFor="momo">
                        Momo
                      </label>
                    </div>
                  </div>
                )}
              </div>


              {/* Navigation */}
              <div className="col-12 d-flex justify-content-between align-items-center mt-4">
                <Link to="/cart" className="text-dark d-flex align-items-center text-decoration-none">
                  <IoIosArrowBack className="me-1" /> Quay về giỏ hàng
                </Link>
                <button type="submit" className="btn btn-primary px-4 py-2 shadow-sm">Đặt hàng</button>
              </div>
            </form>

          </div>
        </div>

              

        {/* Right */}
        <div className="col-lg-5 col-md-12">
          <div className="checkout-summary bg-white p-4 rounded shadow-sm">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Discount code"
                className="form-control mb-2 shadow-sm"
                defaultValue={getCart?.discount || coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="btn btn-dark w-100" onClick={handleApplyCoupon}>Apply Coupon</button>
            </div>

            {items.map((item, index) => (
              <div className="d-flex gap-3 align-items-center border-bottom py-3" key={index}>
                <div className="position-relative" style={{ width: "80px", height: "80px" }}>
                  <img
                    src={item.product?.images?.[0]?.url || ""}
                    alt={item.product?.title}
                    className="img-fluid rounded border shadow-sm"
                  />
                  <span className="position-absolute top-0 end-0 badge bg-secondary rounded-circle">{item.quantity}</span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.product?.title}</h6>
                  <small className="text-muted">{item.color?.title || "No color"}</small>
                </div>
                <div>
                  <span className="text-dark fw-bold">
                    {(item.price * item.quantity).toLocaleString("en-US", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              </div>
            ))}

            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>{cartTotal.toLocaleString("en-US", { style: "currency", currency: "VND" })}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Shipping:</span>
                <span>0₫</span>
              </div>
            </div>
            {(showCoupon) &&  (
              <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between mt-2">
                <span>Coupon Name:</span>
                <span>{getCart?.discount}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Total discount:</span>
                <span>{(cartTotal - totalAfterDiscount).toLocaleString("en-US", { style: "currency", currency: "VND" })}</span>
              </div>
            </div>
            )}
            <div className="d-flex justify-content-between mt-3 pt-3 border-top">
              <h5>Total:</h5>
              <h5 className="text-success">
                {totalAfterDiscount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "VND",
                })}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Checkout;
