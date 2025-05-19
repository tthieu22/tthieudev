import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createCategory,
  getaCategory,
  resetState,
  updateCategory,
} from "../features/category/categoryClice";

let schema = Yup.object().shape({
  title: Yup.string().required("Category name is required"),
});

const Addcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getCategoryId = location.pathname.split("/")[3];

  const newCategory = useSelector((state) => state.category);
  const { isSuccess, isError, createcategory, categoryName, updatecategory } =
    newCategory || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getCategoryId !== undefined) {
        const data = { id: getCategoryId, categoryData: values };
        dispatch(updateCategory(data));
      } else {
        dispatch(createCategory(values));
      }
      setTimeout(() => {
        formik.resetForm();
        navigate("/admin/list-category");
        dispatch(resetState());
      }, 100);
    },
  });

  useEffect(() => {
    if (getCategoryId) {
      dispatch(getaCategory(getCategoryId));
    } else {
      dispatch(resetState());
    }
  }, [dispatch, getCategoryId]);

  useEffect(() => {
    if (isSuccess) {
      if (createcategory) {
        toast.success("Category Added Successfully!");
      } else if (updatecategory) {
        toast.success("Category Updated Successfully!");
      }
    }
    if (isError) {
      toast.error("Something went wrong!");
    }
  }, [isSuccess, isError, createcategory, updatecategory]);

  return (
    <div>
      <h3 className="mb-4 title">
        {getCategoryId !== undefined ? "Edit" : "Add"} category
      </h3>
      <form action="" onSubmit={formik.handleSubmit}>
        <CustomInput
          type="text"
          label="Enter category title"
          name="title"
          onChange={formik.handleChange("title")}
          onBlur={formik.handleBlur("title")}
          value={formik.values.title}
          id="cat"
        />
        <div className="error">
          {formik.touched.title && formik.errors.title}
        </div>
        <button
          type="submit"
          className="btn btn-success border-0 rounded-3 my-5"
        >
          {getCategoryId ? "Update" : "Add"} category
        </button>
      </form>
    </div>
  );
};

export default Addcat;
