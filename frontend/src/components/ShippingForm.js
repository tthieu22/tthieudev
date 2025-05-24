// components/ShippingForm.jsx
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const ShippingForm = ({
  formik,
  userData,
  paymentMethod,
  setPaymentMethod,
  selectedMethod,
  setSelectedMethod,
  setShowPaymentPopup,
}) => {
  return (
    <>
      <h4 className="title mb-2 fw-bold" style={{ fontSize: "20px"}}>Thông tin đơn hàng</h4>
      <p className="user-detail fw-bold text-dark mb-4" >
        {userData.firstname} {userData.lastname} ({userData.email})
      </p>

      <h4 className="mb-3">Địa chỉ giao hàng</h4>
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
            <option value="" disabled>Chọn quốc gia</option>
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
            placeholder="Họ tên"
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
            placeholder="Số điện thoại"
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
            placeholder="Địa chỉ "
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
            placeholder="Huyện"
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
            placeholder="Thành phố"
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
          <label className="form-label fw-semibold mb-3 payment-method-label">Chọn phương thức thanh toán</label>

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
              Thanh toán online
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
              Thanh toán khi giao hàng
            </label>
          </div>

          {paymentMethod === "online" && (
            <div className="payment-method-details mt-4 ps-3 border-start border-3 border-primary payment-online-details">
              <label className="form-label fw-semibold mb-2 online-method-label">Chọn phương thức thanh toán</label>

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
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="col-12 d-flex justify-content-between align-items-center mt-4">
          <Link to="/cart" className="text-dark d-flex align-items-center text-decoration-none">
            <IoIosArrowBack className="me-1" /> Quay về giỏ hàng
          </Link>
          <button type="submit" className="btn button p-4 py-3 shadow-sm">Đặt hàng</button>
        </div>
      </form>
    </>
  );
};

export default ShippingForm;
