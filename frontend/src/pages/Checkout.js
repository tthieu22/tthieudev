import React, { useState, useEffect, useMemo } from "react"; 
import { Link ,useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "../components/Container";
import { getCartUser , applyCoupon, resetStatus , emptyCartAction } from "../features/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createOrder, payVnPay } from "../features/order/orderSlice";
import CartItem from "../components/CartItem";
import ShippingForm from "../components/ShippingForm";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadCart, setLoadCart] = useState(true);
  const [apllyCoupon, setApplyCoupon] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false); 
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const getCart = useSelector((state) => state.auth.getCart);
  const items = useMemo(() => Array.isArray(getCart?.items) ? getCart.items : [], [getCart?.items]);

  const cartTotal = getCart?.cartTotal || 0;
  const totalAfterDiscount = getCart?.totalAfterDiscount || cartTotal;

  const { isSuccess, isError, isApplyCoupon } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!loadCart) { 
      if (items.length === 0) { 
        navigate("/cart");
      }
    }
  }, [items, loadCart, navigate]);

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
        dispatch(emptyCartAction());
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
        dispatch(emptyCartAction());
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
    <> 
      <Meta title="Cart" />
      <BreadCrumb title="Cart" />
      <Container class1="checkout-wrapper home-wrapper-2 py-5">
        <div className="row">
          {/* Left */}
          <div className="col-lg-7 col-md-12 mb-4" >
            <div className="checkout-left-data bg-white p-4 rounded shadow-sm">
              <h3 className="websitename mb-3 fs-1 fw-bold">tthieu.dev</h3>

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

              <ShippingForm
                formik={formik}
                userData={userData}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                setShowPaymentPopup={setShowPaymentPopup}
              />
            </div>
          </div>
                
          {/* Right */}
          <div className="col-lg-5 col-md-12">
            <div className="checkout-summary bg-white p-4 rounded shadow-sm">
              <div className="mb-3 d-flex gap-30 align-content-center">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="form-control shadow-sm w-100"
                  defaultValue={getCart?.discount || coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button className="btn  button" onClick={handleApplyCoupon}>Apply Coupon</button>
              </div> 
              <div className="content-cart" style={ { borderTop : "1px solid #ccc"}}>
                <h5 className="mt-4 mb-0">Sản phẩm ({items.length})</h5>
                {items.map((item, index) => (
                  <CartItem key={index} item={item} />
                ))} 
  
              </div>
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
    </>
  );
};

export default Checkout;
