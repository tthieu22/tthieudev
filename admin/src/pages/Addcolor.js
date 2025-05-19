import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createColor,
  getaColor,
  updateColor,
} from "../features/color/colorClice";
import { resetState } from "../features/blog/blogClice";
import { ColorPicker } from "antd";

let schema = Yup.object().shape({
  title: Yup.string().required("Color name is required"),
});

const Addcolor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getColorId = location.pathname.split("/")[3];
  const newColor = useSelector((state) => state.color);
  const { isSuccess, isError, createcolor, colorName, updatecolor } =
    newColor || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: colorName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getColorId !== undefined) {
        const data = { id: getColorId, colorData: values };
        dispatch(updateColor(data));
      } else {
        dispatch(createColor(values));
      }
      setTimeout(() => {
        formik.resetForm();
        navigate("/admin/list-color");
        dispatch(resetState());
      }, 100);
    },
  });

  useEffect(() => {
    if (getColorId) {
      dispatch(getaColor(getColorId));
    } else {
      dispatch(resetState());
    }
  }, [dispatch, getColorId]);

  useEffect(() => {
    if (isSuccess) {
      if (createcolor) {
        toast.success("Color added successfully!");
      } else if (updatecolor) {
        toast.success("Color updated successfully!");
      }
    }
    if (isError) {
      toast.error("Something went wrong!");
    }
  }, [isSuccess, isError, createcolor, updatecolor]);

  return (
    <div>
      <h3 className="mb-4 title">
        {getColorId !== undefined ? "Edit" : "Add"} color
      </h3>
      <form action="" onSubmit={formik.handleSubmit}>
        <ColorPicker
          defaultValue="#1677ff"
          size="large"
          showText
          name="title"
          onChange={(color) => {
            const colorRGBA = color.toRgbString();
            formik.setFieldValue("title", colorRGBA);
          }}
          onBlur={() => formik.setFieldTouched("title", true)}
          value={formik.values.title}
        />
        <div className="error">
          {formik.touched.title && formik.errors.title}
        </div>
        <button
          type="submit"
          className="btn btn-success border-0 rounded-3 my-5"
        >
          {getColorId !== undefined ? "Edit" : "Add"} Color
        </button>
      </form>
    </div>
  );
};

export default Addcolor;
