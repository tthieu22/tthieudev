import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createBlog,
  resetState,
  getaBlog,
  uploadBlogImages,
  deleteBlogImages,
  updateaBlog,
} from "../features/blog/blogClice";
import { deleteImg, uploadImg } from "../features/upload/uploadClice";
import Dropzone from "react-dropzone";
import { getBlogCategorys } from "../features/blogcategory/blogcategoryClice";

let schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const AddBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3]; 
  const { isSuccess, isError, createblog, updateImage, deleteImage, updateBlog } = useSelector((state) => state.blog)|| {};

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    category: "",
    images: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try { 
        const categoryAction = await dispatch(getBlogCategorys());
        if (getBlogCategorys.fulfilled.match(categoryAction)) {
          setCategories(categoryAction.payload);
        }
 
        if (getBlogId) {
          const blogAction = await dispatch(getaBlog(getBlogId));
          if (getaBlog.fulfilled.match(blogAction)) {
            const blog = blogAction.payload;
            console.log("blog", blog);
            
            setImages(blog.images || []);
            setInitialValues({
              title: blog.title || "",
              description: blog.description || "",
              category: blog.category || "",
              images: blog.images || [],
            });
          }
        } else { 
          setImages([]);
          setInitialValues({
            title: "",
            description: "",
            category: "",
            images: [],
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu blog:", error);
      }
    };

    fetchData();
  }, [dispatch, getBlogId]);

  useEffect(() => {
    if (isSuccess && createblog) toast.success("Bài viết đã được thêm thành công!");
    if (isSuccess && updateImage) toast.success("Hình ảnh đã được cập nhật thành công!");
    if (isSuccess && deleteImage) toast.success("Hình ảnh đã được xóa thành công!");
    if (isSuccess && updateBlog) toast.success("Bài viết đã được cập nhật thành công!");
    if (isError) toast.error("Đã xảy ra lỗi!");
  }, [isSuccess, isError, createblog, updateImage, deleteImage, updateBlog]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      values.images = images;
      if (getBlogId) {
        dispatch(updateaBlog({ id: getBlogId, blog: values }));
      } else {
        dispatch(createBlog(values));
      }
      setTimeout(() => {
        navigate("/admin/blog-list");
        dispatch(resetState());
      }, 3000);
    },
  });

  useEffect(() => {
    if (formik.values.images !== images) {
      formik.setFieldValue("images", images);
    }
  }, [images, formik]); 
  
  const handleUploadImages = async (files) => {
    try {
      let result;
  
      if (getBlogId) { 
        result = await dispatch(uploadBlogImages({ id: getBlogId, data: files }));
      } else {
        result = await dispatch(uploadImg(files));
      }
  
      if (result?.payload) {
        const imagesArray = Array.isArray(result.payload.images) ? result.payload.images : [];
        setImages(imagesArray);
        toast.success("Upload ảnh thành công!");
      } else {
        console.error("Upload failed:", result);
        toast.error("Upload ảnh thất bại!");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Lỗi khi upload ảnh!");
    }
  };
  
    
  const handleDeleteImage = async (publicId) => {
    try {
      let result;

      if (getBlogId) {
        result = await dispatch(deleteBlogImages(publicId));
      } else {
        result = await dispatch(deleteImg(publicId));
      }

      if (result?.meta?.requestStatus === "fulfilled") { 
        setImages((prevImages) =>
          prevImages.filter((img) => img.public_id !== publicId)
        );
        toast.success("Xóa ảnh thành công!");
      } else {
        console.error("Delete failed:", result);
        toast.error("Xóa ảnh thất bại!");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Lỗi khi xóa ảnh!");
    }
  };

  return (
    <div>
      <h3 className="mt-4 title">{getBlogId ? "Cập nhật" : "Thêm"} bài viết</h3>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Nhập tiêu đề bài viết"
            name="title"
            onChange={formik.handleChange("title")}
            onBlur={formik.handleBlur("title")}
            value={formik.values.title}
          />
          <div className="error">{formik.touched.title && formik.errors.title}</div>
          <select
            name="category"
            className="form-control py-3 my-3"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
          >
            <option value="" disabled>Chọn danh mục</option>
            {categories.map((item) => (
              <option value={item.title} key={item._id}>{item.title}</option>
            ))}
          </select>
          <div className="error">{formik.touched.category && formik.errors.category}</div>
          <ReactQuill
            className="mt-3"
            theme="snow"
            name="description"
            onChange={(value) => formik.setFieldValue("description", value)}
            onBlur={() => formik.setFieldTouched("description", true)}
            value={formik.values.description}
            placeholder="Nhập mô tả bài viết"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="error">{formik.errors.description}</div>
          )}
          <div className="bg-white border-1 mt-4">
            <Dropzone onDrop={handleUploadImages} multiple>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p className="p-5 text-center">Kéo và thả hình ảnh vào đây hoặc nhấn để chọn tệp</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="preview-images mt-3 d-flex gap-3 flex-wrap">
            {images.map((img, index) => (
              <div key={img.public_id + "_" + index} className="position-relative">
                <img src={img.url} alt="preview" width={100} height={100} />
                <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleDeleteImage(img.public_id)}>X</button>
              </div>
            ))}
          </div>
          <div className="error">{formik.touched.images && formik.errors.images}</div>
          <button type="submit" className="btn btn-primary mt-4">{getBlogId ? "Cập nhật" : "Thêm"} bài viết</button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
