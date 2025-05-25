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
  specialDateTime: Yup.string().when("tags", (tags, schema) => {
    if (Array.isArray(tags) && tags.includes("Special")) {
      return schema.required("Ngày giờ đặc biệt là bắt buộc khi chọn thẻ Special")
        .test(
          "valid-datetime",
          "Ngày giờ không hợp lệ",
          (value) => !value || !isNaN(new Date(value).getTime())
        );
    }
    return schema.notRequired().nullable(true);
  }),
  originalPrice: Yup.number()
    .typeError("Giá chưa giảm phải là số")
    .when("tags", (tags, schema) => {
      if (Array.isArray(tags) && (tags.includes("Special") || tags.includes("Sale"))) {
        return schema.required("Giá chưa giảm là bắt buộc khi có thẻ Special hoặc Sale").positive("Phải là số dương");
      }
      return schema.notRequired().nullable(true);
    }),

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
    originalPrice: "",
    category: "",
    tags: [],
    color: [],
    brand: "",
    quantity: "",
    images: [],
    specialDateTime: "",
  }); 
   
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]); 
  
  const { isSuccess, isError, createdProduct, uploadedImages, deletedImage} = useSelector(
    (state) => state.product
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandAction = await dispatch(getBrands());
        const categoryAction = await dispatch(getCategories());
        const colorAction = await dispatch(getColors());
  
        if (getBrands.fulfilled.match(brandAction)) {
          setBrands(brandAction.payload);
        }
        if (getCategories.fulfilled.match(categoryAction)) {
          setCategories(categoryAction.payload);
        }
        if (getColors.fulfilled.match(colorAction)) {
          setColors(colorAction.payload);
        }
  
        if (productId) {
          const productAction = await dispatch(getaProduct(productId));
          if (getaProduct.fulfilled.match(productAction)) {
            const prod = productAction.payload; 
            setImages(prod.images || []);
            setInitialValues({
              title: prod.title || "",
              description: prod.description || "",
              price: prod.price || "",
              category: prod.category || "",
              tags: prod.tags || [],
              color: prod.color || [],
              brand: prod.brand || "",
              quantity: prod.quantity || "",
              images: prod.images || [],
              specialDateTime: prod.specialDateTime || "",
              originalPrice: prod.originalPrice || "",
            });
          }
        } else { 
          setImages([]);
          setInitialValues({
            title: "",
            description: "",
            price: "",
            category: "",
            tags: [],
            color: [],
            brand: "",
            quantity: "",
            images: [],
            specialDateTime: "",
            originalPrice: "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
  
    fetchData();
  }, [productId, dispatch]); 
  
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
      if (!values.tags.includes("Special")) {
        values.specialDateTime = "";
      }
      values.images = images;
      if (productId) {
        dispatch(updateProduct({ id: productId, product: values }));
      } else {
        dispatch(createProduct(values));
      }
      setTimeout(() => {
        navigate("/admin/product-list");
        dispatch(resetState());
      }, 1000);
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
  
      if (productId) { 
        result = await dispatch(uploadProductImages({ productId, data: files }));
      } else { 
        result = await dispatch(uploadImg(files));
      }  
      
      if (result?.payload) { 
        const imagesArray = Array.isArray(result.payload ) ? result.payload : [];
        setImages(imagesArray);
        
        toast.success("Up load ảnh thành công!");
      } else {
        console.error("Upload failed:", result);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  
  
  const handleDeleteImage = async (publicId) => {
    try {
      let result;

      if (productId) {
        result = await dispatch(deleteProductImage(publicId));
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
  const formatDateTimeLocal = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
          {categories.map((i) => (
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
        {(formik.values.tags.includes("Special") || formik.values.tags.includes("Sale")) && (
          <div className="my-3">
            {formik.values.tags.includes("Special") && (
              <>
                <label htmlFor="specialDateTime">Chọn ngày và thời gian:</label>
                <input
                  type="datetime-local"
                  id="specialDateTime"
                  name="specialDateTime"
                  className="form-control"
                  value={formik.values.specialDateTime ? formatDateTimeLocal(formik.values.specialDateTime) : ""} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className="error">
                  {formik.touched.specialDateTime && formik.errors.specialDateTime}
                </div>
              </>
            )}

            <label htmlFor="originalPrice" className="mt-3">Giá chưa giảm:</label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              className="form-control"
              value={formik.values.originalPrice || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="error">
              {formik.touched.originalPrice && formik.errors.originalPrice}
            </div>
          </div>
        )}

        <div className="error">{formik.touched.tags && formik.errors.tags}</div>
        <Select
          mode="multiple"
          allowClear
          placeholder="Chọn màu"
          className="form-control py-3 my-3"
          options={colors.map((c) => ({
            label: (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: c.title,  
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    display: "inline-block",
                  }}
                ></span>
                <span>{c.title}</span>
              </div>
            ),
            value: c.title, // hoặc c._id nếu dùng id
          }))}
          value={formik.values.color}
          onChange={(v) => formik.setFieldValue("color", v)}
        />
        <div className="error">
          {formik.touched.color && formik.errors.color}
        </div>

        <select name="brand" className="form-control py-3 my-3" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.brand}>
          <option value="">Chọn thương hiệu</option>
          {brands.map((b) => (
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
