import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCoupon, resetState } from "../features/coupon/couponSlice";
let schema = Yup.object().shape({
  name: Yup.string().required("Coupon name is required"),
  expiry: Yup.string().required("Coupon expiry is required"),
  discount: Yup.number().required("Coupon expiry is required"),
});
const AddCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const newCoupon = useSelector((state) => state.coupon);
  const { isSuccess, isError, createcoupon } = newCoupon || {};
  const formik = useFormik({
    initialValues: {
      name: "",
      expiry: "",
      discount: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(createCoupon(values));
      formik.resetForm();
      setTimeout(() => {
        navigate("/admin/coupon-list");
        dispatch(resetState());
      }, 2000);
    },
  });

  useEffect(() => {
    if (isSuccess && createcoupon) {
      toast.success("🦄 Coupon Added Successfully!");
    }
    if (isError) {
      toast.error("🦄 Something went wrong!");
    }
  }, [isSuccess, isError, createcoupon, navigate, formik]);
  return (
    <div>
      <h3 className="mb-4 title">Add Coupon</h3>
      <form action="" onSubmit={formik.handleSubmit}>
        <CustomInput
          type="text"
          label="Enter coupon name"
          name="name"
          onChange={formik.handleChange("name")}
          onBlur={formik.handleBlur("name")}
          value={formik.values.name}
          id="brand"
        />
        <div className="error">{formik.touched.name && formik.errors.name}</div>
        <CustomInput
          type="date"
          label="Enter coupon date"
          name="expiry"
          onChange={formik.handleChange("expiry")}
          onBlur={formik.handleBlur("expiry")}
          value={formik.values.expiry}
          id="brand"
        />
        <div className="error">
          {formik.touched.expiry && formik.errors.expiry}
        </div>
        <CustomInput
          type="number"
          label="Enter discount"
          name="expiry"
          onChange={formik.handleChange("discount")}
          onBlur={formik.handleBlur("discount")}
          value={formik.values.discount}
          id="brand"
        />
        <div className="error">
          {formik.touched.discount && formik.errors.discount}
        </div>
        <button
          type="submit"
          className="btn btn-success border-0 rounded-3 my-5"
        >
          Add Coupon
        </button>
      </form>
    </div>
  );
};

export default AddCoupon;
