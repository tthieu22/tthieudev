import { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandClice";
import { getCategories } from "../features/category/categoryClice";
import { getColors } from "../features/color/colorClice";
import Dropzone from "react-dropzone";
import { Select } from "antd";
import {
  deleteImg,
  uploadImg,
} from "../features/upload/uploadClice";
import {
  createProduct,
  resetState,
  getaProduct,
  deleteProductImage,
  uploadProductImages,
  updateProduct,
} from "../features/product/productClice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const schema = Yup.object().shape({
  title: Yup.string().required("Tiêu đề là bắt buộc"),
  description: Yup.string().required("Mô tả là bắt buộc"),
  price: Yup.number()
    .typeError("Giá phải là một số")
    .required("Giá là bắt buộc")
    .positive("Giá phải là số dương"),
  category: Yup.string().required("Danh mục là bắt buộc"),
  tags: Yup.array().min(1, "Ít nhất một thẻ là bắt buộc"),
  color: Yup.array()
    .min(1, "Ít nhất một màu là bắt buộc")
    .required("Màu sắc là bắt buộc"),
  brand: Yup.string().required("Thương hiệu là bắt buộc"),
  quantity: Yup.number()
    .typeError("Số lượng phải là một số")
    .required("Số lượng là bắt buộc")
    .positive("Số lượng phải là số dương"),
  images: Yup.array().min(1, "Ít nhất một hình ảnh là bắt buộc"),
});

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.pathname.split("/")[3];

  const [images, setImages] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    tags: [],
    color: [],
    brand: "",
    quantity: "",
    images: [],
  });

  const brandstate = useSelector((state) => state.brand.brands);
  const categorystate = useSelector((state) => state.category.categories);
  const colorstate = useSelector((state) => state.color.colors);
  const imagestate = useSelector((state) => state.upload.images);
  const productState = useSelector((state) => state.product);
  const {
    isSuccess,
    isError,
    createdProduct,
    uploadedImages,
    deletedImage,
    singleProduct,
  } = productState;

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    if (productId) dispatch(getaProduct(productId));
    else dispatch(resetState());
  }, [dispatch, productId]);

  useEffect(() => {
    if (productId && singleProduct) {
      setInitialValues({
        title: singleProduct.title || "",
        description: singleProduct.description || "",
        price: singleProduct.price || "",
        category: singleProduct.category || "",
        tags: singleProduct.tags || [],
        color: singleProduct.color || [],
        brand: singleProduct.brand || "",
        quantity: singleProduct.quantity || "",
        images: singleProduct.images || [],
      });
      setImages(singleProduct.images || []);
    }
  }, [singleProduct, productId]);

  useEffect(() => {
    if (imagestate?.length > 0) {
      const imgs = imagestate.map((i) => ({
        public_id: i.public_id,
        url: i.url,
      }));
      setImages(imgs);
    }
  }, [imagestate]);

  useEffect(() => {
    if (isSuccess && createdProduct) toast.success("Sản phẩm đã được thêm thành công!");
    if (isSuccess && uploadedImages) toast.success("Hình ảnh đã được tải lên thành công!");
    if (isSuccess && deletedImage) toast.success("Hình ảnh đã được xóa thành công!");
    if (isError) toast.error("Có lỗi xảy ra!");
  }, [isSuccess, isError, createdProduct, uploadedImages, deletedImage]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      values.images = images;
      if (productId) {
        dispatch(updateProduct({ id: productId, product: values }));
      } else {
        dispatch(createProduct(values));
      }
      setTimeout(() => {
        navigate("/admin/product-list");
        dispatch(resetState());
      }, 3000);
    },
  });

  
  useEffect(() => {
    if (formik.values.images !== images) {
      formik.setFieldValue("images", images);
    }
  }, [images, formik]);
  
  const handleUploadImages = (files) => {
    if (productId) {
      dispatch(uploadProductImages({ productId, data: files }));
    } else {
      dispatch(uploadImg(files));
    }
  };

  const handleDeleteImage = (publicId) => {
    if (productId) dispatch(deleteProductImage(publicId));
    else dispatch(deleteImg(publicId));
  };

  return (
    <div>
      <h3 className="mb-4 title">{productId ? "Sửa" : "Thêm"} sản phẩm</h3>
      <form onSubmit={formik.handleSubmit}>
        <CustomInput name="title" onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" label="Nhập tiêu đề sản phẩm" value={formik.values.title} />
        <div className="error">{formik.touched.title && formik.errors.title}</div>
        <ReactQuill className="mt-3" theme="snow" onChange={(val) => formik.setFieldValue("description", val)} value={formik.values.description} />
        <div className="error">{formik.touched.description && formik.errors.description}</div>
        <CustomInput name="price" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.price} type="number" label="Nhập giá" i_class="mt-3" />
        <div className="error">{formik.touched.price && formik.errors.price}</div>
        <select name="category" className="form-control py-3 my-3" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.category}>
          <option value="">Chọn danh mục</option>
          {categorystate.map((i) => (
            <option key={i._id} value={i.title}>{i.title}</option>
          ))}
        </select>
        <div className="error">{formik.touched.category && formik.errors.category}</div>
        <Select mode="multiple" allowClear placeholder="Chọn thẻ" className="form-control py-3 my-3" value={formik.values.tags} onChange={(v) => formik.setFieldValue("tags", v)}>
          <Select.Option value="Featured">Featured</Select.Option>
          <Select.Option value="Popular">Popular</Select.Option>
          <Select.Option value="Special">Special</Select.Option>
          <Select.Option value="Sale">Best sale</Select.Option>
          <Select.Option value="SUPPERCHARGED">SUPPERCHARGED FOR PROS</Select.Option>
          <Select.Option value="Famous">Famous</Select.Option>
        </Select>
        <div className="error">{formik.touched.tags && formik.errors.tags}</div>
        <Select mode="multiple" allowClear placeholder="Chọn màu" className="form-control py-3 my-3" options={colorstate.map((c) => ({ label: c.title, value: c.title }))} value={formik.values.color} onChange={(v) => formik.setFieldValue("color", v)} />
        <div className="error">{formik.touched.color && formik.errors.color}</div>
        <select name="brand" className="form-control py-3 my-3" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.brand}>
          <option value="">Chọn thương hiệu</option>
          {brandstate.map((b) => (
            <option key={b._id} value={b.title}>{b.title}</option>
          ))}
        </select>
        <div className="error">{formik.touched.brand && formik.errors.brand}</div>
        <CustomInput name="quantity" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.quantity} type="number" label="Nhập số lượng" i_class="mt-3" />
        <div className="error">{formik.touched.quantity && formik.errors.quantity}</div>
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
          {images.map((img) => (
            <div key={img.public_id} className="position-relative">
              <img src={img.url} alt="preview" width={100} height={100} />
              <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleDeleteImage(img.public_id)}>X</button>
            </div>
          ))}
        </div>
        <div className="error">{formik.touched.images && formik.errors.images}</div>
        <button type="submit" className="btn btn-primary mt-4">{productId ? "Cập nhật" : "Thêm"} sản phẩm</button>
      </form>
    </div>
  );
};

export default AddProduct;
