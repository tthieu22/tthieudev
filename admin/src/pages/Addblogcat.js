import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate , useLocation} from "react-router-dom";
import { toast } from "react-toastify";
import { createBlogCategory, getaBlogCategory , updateBlogCategory } from "../features/blogcategory/blogcategoryClice";
import { resetState } from "../features/blog/blogClice";

let schema = Yup.object().shape({
  title: Yup.string().required("Danh mục bài viết là bắt buộc"),
});

const Addblogcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const newBlogCategory = useSelector((state) => state.blogcategory);
  const { isSuccess, isLoading, isError, newBlogCat, updatedBlogCategory ,singleBlogCategory } = newBlogCategory || {};
  const blogcatId = location.pathname.split("/")[3];
  useEffect(() => {
    if ( blogcatId !== undefined) {
      dispatch(getaBlogCategory(blogcatId));
    }
    else {
      dispatch(resetState());
    }
  }, [blogcatId, dispatch]);
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: singleBlogCategory?.title?.trim() || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (blogcatId) {
        const data = { id: blogcatId, catData: values };
        dispatch(updateBlogCategory(data));
        dispatch(resetState());
        setTimeout(() => {
          navigate("/admin/blog-category-list");
        }, 300);
      } else {
        dispatch(createBlogCategory(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          navigate("/admin/blog-category-list");
        }, 300);
      }
    },
  });

  useEffect(() => {
    if (isSuccess && newBlogCat) {
      toast.success("Blog Category Added Successfullly!");
    }
    if (isSuccess && updatedBlogCategory) {
      toast.success("Blog Category Updated Successfullly!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, newBlogCat, updatedBlogCategory]);

  return (
    <div>
      <h3 className="mb-4 title">{blogcatId ? "Edit" : "Add"} Blog Category</h3>
      <form action="" onSubmit={formik.handleSubmit}>
        <CustomInput
          type="text"
          label="Enter blog category title"
          name="title"
          onChange={formik.handleChange("title")}
          onBlur={formik.handleBlur("title")}
          value={formik.values.title}
          id="blogcat"
        />
        <div className="error">
          {formik.touched.title && formik.errors.title}
        </div>
        <button
          type="submit"
          className="btn btn-success border-0 rounded-3 my-5"
        >
          {blogcatId ? "Edit" : "Add"} category blog
        </button>
      </form>
    </div>
  );
};

export default Addblogcat;
