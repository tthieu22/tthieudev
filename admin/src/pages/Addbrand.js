import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createBrand,
  getaBrand,
  resetState,
  updateBrand,
} from "../features/brand/brandClice";

let schema = Yup.object().shape({
  title: Yup.string().required("Brand name is required"),
});

const Addbrand = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBrandId = location.pathname.split("/")[3];

  const newBrand = useSelector((state) => state.brand);
  const { isSuccess, isError, createBrands, brandName, updatebrand } =
    newBrand || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: brandName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getBrandId !== undefined) {
        const data = { id: getBrandId, brandData: values };
        dispatch(updateBrand(data));
      } else {
        dispatch(createBrand(values));
      }
      setTimeout(() => {
        formik.resetForm();
        navigate("/admin/list-brand");
        dispatch(resetState());
      }, 100);
    },
  });
  useEffect(() => {
    if (getBrandId) {
      dispatch(getaBrand(getBrandId));
    } else {
      dispatch(resetState());
    }
  }, [dispatch, getBrandId]);

  useEffect(() => {
    if (isSuccess) {
      if (createBrands) {
        toast.success(" Brand Added Successfully!");
      } else if (updatebrand) {
        toast.success(" Brand Updated Successfully!");
      }
    }
    if (isError) {
      toast.error(" Something went wrong!");
    }
  }, [isSuccess, isError, createBrands, updatebrand]);
  return (
    <div>
      <h3 className="mb-4 title">
        {getBrandId !== undefined ? "Edit" : "Add"} Brand
      </h3>
      <form action="" onSubmit={formik.handleSubmit}>
        <CustomInput
          type="text"
          label="Enter brand title"
          name="title"
          onChange={formik.handleChange("title")}
          onBlur={formik.handleBlur("title")}
          value={formik.values.title}
          id="brand"
        />
        <div className="error">
          {formik.touched.title && formik.errors.title}
        </div>
        <button
          type="submit"
          className="btn btn-success border-0 rounded-3 my-5"
        >
          {getBrandId ? "Update" : "Add"} brand
        </button>
      </form>
    </div>
  );
};

export default Addbrand;
