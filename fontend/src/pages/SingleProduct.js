import React, { useState,useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import StarRatings from 'react-star-ratings';
import Color from "../components/Color";
import wish from "../images/wish.svg";
import filledWish from "../images/wished.svg";
import { DiGitCompare } from "react-icons/di";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import { useLocation ,useNavigate} from "react-router-dom";
import { getAproduct } from "../features/product/productSlice";
import { getAWishList ,addToCart } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllCompare, addToCompare,resetStatusCompare } from "../features/compare/compareSlice";
import { addToWishList ,getAllProduct } from "../features/product/productSlice";

let schema = Yup.object().shape({
  productId: Yup.string().required("Required"),
  quantity: Yup.number()
    .required("Bạn chưa nhập số lượng")
    .min(1, "Số lượng phải lớn hơn 0"),
  color: Yup.string().required("Hãy chọn màu sắc"),
});

const SingleProduct = () => {
  const [orderedProduct] = useState(true);
  const [rating, setRating] = useState(5);
  const [load, setLoad] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.pathname.split("/").pop();

  const otherproductstate = useSelector((state) => state?.product?.product) || [];
  const productState = useSelector((state) => state?.product?.Aproduct || []);
  const wishliststate = useSelector((state) => state?.auth?.wishlist?.wishlist || []);
  const otherProducts = otherproductstate
  .filter((product) => product._id !== productId)
  .slice(0, 4);

  
  const newCart = useSelector((state) => state.auth) || [];
  const { isSuccess, isError, addCart } = newCart || {};
  const [isClickedAddToCart, setIsClickedAddToCart] = useState(false);

  // Compare
  const compareState = useSelector((state) => state?.compare) || [];
  const { isAddCompare } = compareState || {};
  const [isClickAddCompare, setIsClickAddCompare] = useState(false);

  const [compared, setCompared] = useState(false);
  // Check Compare
  useEffect(() => {
    const existingCompare = JSON.parse(localStorage.getItem("compare")) || [];
    const isCompared = existingCompare.some(item => item._id === productId);
    setCompared(isCompared);
  }, [productId]);
  
  // Add Compare
  const handleAddToCompare = () => {
    if (productId !== undefined) {
      dispatch(addToCompare(productId));
      dispatch(resetStatusCompare());
      setIsClickAddCompare(true);
    }
  }

  // Get Product
  useEffect(() => { 
    if(load === false) return;
    if (productId !== undefined) {
      dispatch(getAproduct(productId));
      dispatch(getAllCompare());
      dispatch(getAWishList());
      dispatch(getAllProduct());
    }
    setLoad(false);
  }, [dispatch, productId,load]);  
  
  // Handle Rating
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Formilk
  const formik = useFormik({
    initialValues: {
      productId: productId || "",
      quantity: 1,
      color: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(addToCart({
        productId: values.productId,
        quantity: values.quantity,
        colorId: values.color,
      }));
      setIsClickedAddToCart(true);
      formik.resetForm();
    },
  });
  
  // Toast
  useEffect(() => {
    if (!isClickedAddToCart) return;
    if (isSuccess === true &&  addCart !== undefined) {
      toast.success("Đã thêm vào giỏ hàng", {
        onClick: () => {
          navigate("/cart");
        },
      });
    } 
    else if (isError === true) {
      toast.error("Thêm vào giỏ hàng thất bại. Vui lòng đăng nhập để thực hiện thao tác này", {
        onClick: () => {
          navigate("/login");
        },
        autoClose: false,
      });
      
    }
   
    
    setIsClickedAddToCart(false);
  }, [isSuccess, addCart, isError, isClickedAddToCart ,navigate]);
  // Toast Compare
  useEffect(() => {
    if(!isClickAddCompare) return;
    if (isAddCompare === true ) {
      toast.success(compareState?.message);
      setCompared(true);
    }
    if (isAddCompare === false) {
      toast.info(compareState?.message);
      setCompared(false);
    }
    setIsClickAddCompare(false);
  }, [isAddCompare, compareState?.message ,isClickAddCompare]);

  // Copy Link
  const copyToClipboard = (text) => {
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success("Đã sao chép liên kết vào clipboard")
  };

  // Add To Wishlist
  const addToWishlist = (id) => {
    const isInWishlist = wishliststate.some((item) => item._id === id);
    dispatch(addToWishList(id));
    setTimeout(() => {
      if (isInWishlist) {
        toast.info("Đã xóa khỏi danh sách yêu thích");
      } else {
        toast.success("Đã thêm vào danh sách yêu thích");
      }
      setLoad(true);
    }, 300);
  };

  return (
    <>
      <Meta title={"Product Name"}></Meta>
      <BreadCrumb title={productState?.title} />
      <Container className="main-product-wapper home-wapper py-5">
        <div className="row">
          <div className="col-6">
            <div className="main-product-image">
            {productState?.images?.length > 0 ? (
              <img
                src={productState.images[0].url}
                alt={productState.images[0].public_id}
                className="img-fluid"
              />
            ) : (
              <p>Không có ảnh sản phẩm</p>
            )}
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={15}
              slidesPerView={4}
              navigation
              breakpoints={{
                1024: {
                  slidesPerView: 4,
                },
                768: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
                0: {
                  slidesPerView: 1,
                },
              }}
              className="other-product-images"
            >
              {productState?.images?.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="other-product-image">
                    <img src={item?.url} alt="product" className="img-fluid" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="col-6">
            <div className="main-product-detail">
              <div className="border-bottom">
                <h3 className="title">
                  {productState?.title}
                </h3>
                </div>
                <div className="border-bottom py-3 price">
                  <p>{productState?.price
                    ? Number(productState.price).toLocaleString("vi-VN") + " ₫"
                    : "Đang cập nhật giá"}
                  </p>

                <div className="d-flex gap-10 align-items-center">
                    <StarRatings
                      rating={parseFloat(productState?.totalrating) || 0}
                      starRatedColor="#ffd700"
                      numberOfStars={5}
                      starDimension="15px"
                      starSpacing="2px"
                    />
                  <p className="t-review mb-0">({productState?.ratings?.length} reviews)</p>
                </div>
                <a
                  href="#review"
                  className="text-dark text-decoration-underline review-btn"
                >
                  Wirte a Review
                </a>
              </div>
              <div className="border-bottom py-3">
                <div className="d-flex gap-10 alight-items-center my-2">
                  <h3 className="product-heading">Type:</h3>
                  <p className="product-data">{productState?.type || "N/A"}</p>
                </div>
                <div className="d-flex gap-10 alight-items-center my-2">
                  <h3 className="product-heading">Brand:</h3>
                  <p className="product-data">{ productState?.brand }</p>
                </div>
                <div className="d-flex gap-10 alight-items-center my-2">
                  <h3 className="product-heading">Category:</h3>
                  <p className="product-data">{ productState?.category }</p>
                </div>
                <div className="d-flex gap-10 alight-items-center my-2">
                  <h3 className="product-heading">Tags:</h3>
                  <p className="product-data">{productState?.tags?.join(", ") || "N/A"}</p>
                </div>
                <div className="d-flex gap-10 alight-items-center my-2">
                  <h3 className="product-heading">Avaiblablity:</h3>
                  <p className="product-data">In stock</p>
                </div>
                {productState?.size && (
                  <div className="d-flex gap-10 flex-column my-2">
                    <h3 className="product-heading">Size:</h3>
                    <div className="d-flex flex-wrap gap-15">
                      {productState?.size.map((size, index) => (
                        <span
                          key={index}
                          className="badge text-dark border border-1 bg-white border-secondary"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  {productState?.color && (
                    <div className="d-flex gap-10 flex-column my-2">
                      <h3 className="product-heading">Color:</h3>
                      <Color
                        prop={productState?.color}
                        selectedColor={formik.values.color}
                        onSelect={(color) => formik.setFieldValue("color", color)}
                      />
                      {formik.touched.color && formik.errors.color && (
                        <div className="text-danger">{formik.errors.color}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="d-flex gap-10 flex-row mb-3 align-items-center">
                  <h3 className="product-heading m-0">Quality:</h3>
                  <div>
                  <input
                      type="number"
                      name="quantity"
                      min={1}
                      max={
                        typeof productState?.quantity === "number" &&
                        typeof productState?.sold === "number"
                          ? productState.quantity - productState.sold
                          : 0
                      }
                      style={{ width: "50px" }}
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.quantity && formik.errors.quantity && (
                      <div className="text-danger">{formik.errors.quantity}</div>
                    )}

                  </div>
                </div>
                <div className="box-add-cart-buy-now">
                  <div className="d-flex gap-10">
                    <button onClick={formik.handleSubmit} className="button border-0">Add to Cart</button>
                    {/* <button to="" className="button border-0">
                      Buy It Now
                    </button> */}
                  </div>
                </div>
                <div className="d-flex gap-10 alight-items-center mt-4 mb-2 gap-30">
                  <div className="d-flex gap-10 align-items-center">
                    <div className=" text-dark fs-7" onClick={(e) => { addToWishlist(productState?._id); }}>
                      <img src={wishliststate?.some((product) => product?._id === productState?._id) ? filledWish : wish} alt="wishlist" width={20} /> Wishlist
                    </div>
                  </div>
                  <div className="d-flex gap-10 align-items-center" onClick={() => handleAddToCompare(productState?._id)}>
                    {compared ? (
                      <>
                        <DiGitCompare />
                        <div className="text-dark fs-7">Remove from Compare</div>
                      </>
                    ) : (
                      <>
                        <DiGitCompare />
                        <div className="text-dark fs-7">Add to Compare</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex alight-items-center my-2 flex-column">
                <h3 className="product-heading">Shipping & Return:</h3>
                <div>
                  <p className="product-data mb-0">
                    Free shipping and returns available on all order
                  </p>
                  <p className="product-data mb-0">
                    Free shipping and returns <b>available on all order</b>
                  </p>
                </div>
              </div>
              <div className="d-flex alight-items-center my-2 flex-column">
                <h3 className="product-heading">Copy Product Link:</h3>

                <button className="copy-clipboard"
                  onClick={() => {
                    copyToClipboard(
                      window.location.href
                    );
                  }}
                >
                  Copy Product Link
                </button>
              </div>
              <div className="d-flex alight-items-center my-2 flex-column">
                <h3 className="product-heading">Material:</h3>
                <div>
                  <p className="product-data mb-0">
                    Free shipping and returns available on all order Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Culpa,
                    provident.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Container class1="desciption-wapper home-wapper-2 mt-4">
          <div className="row">
            <div className="col-12">
              <h3 className="mb-4">Mô tả</h3>
              <div className="bg-white">
              <p className="desc-content"
                dangerouslySetInnerHTML={{
                  __html: productState?.description,
                }}
              ></p>
              </div>
            </div>
          </div>
        </Container>
        <Container class1="review-wapper my-3 home-wapper-2">
          <div className="row">
            <div className="col-12">
              <h4 id="review">Đánh giá</h4>
              <div className="review-inner-wapper">
                <div className="review-head d-flex justify-content-between align-items-end">
                  <div>
                    <h4 className="mb-2">Đánh giá của khách hàng</h4>

                    <div className="d-flex gap-10 align-items-center">
                      <StarRatings
                        rating={parseFloat(productState?.totalrating) || 0}
                        starRatedColor="#ffd700"
                        numberOfStars={5}
                        starDimension="15px"
                        starSpacing="2px"
                      />
                      <p className="mb-0">Dựa trên {productState?.ratings?.length} đánh giá</p>
                    </div>
                  </div>
                  {orderedProduct && (
                    <div>
                      <a
                        href="#d"
                        className="text-dark text-decoration-underline"
                      >
                        Viết 1 đánh giá
                      </a>
                    </div>
                  )}
                </div>
                <div className="review-form py-4">
                  <form action="" className="d-flex flex-column gap-20">
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tên của bạn"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tiêu đề đánh giá"
                      />
                    </div>
                    <div>
                      <StarRatings
                        rating={rating}
                        starRatedColor="#ffd700"
                        numberOfStars={5}
                        starDimension="20px"
                        starSpacing="3px"
                        changeRating={handleRatingChange}
                        edit={true}
                      />
                    </div>
                    <div>
                      <textarea
                        type="text"
                        cols={30}
                        rows={4}
                        className="form-control"
                        placeholder="Nội dung đánh giá"
                      />
                    </div>
                    <button className="button" type="submit">Gửi đánh giá</button>
                  </form>
                </div>
                <div className="reviews mt-3">
                  {productState?.ratings?.length > 0 ? (
                    productState.ratings.map((item, index) => (
                      <div className="review mb-3" key={index}>
                        <div className="d-flex gap-10 align-items-center">
                          <h6 className="mb-0">{item?.postedby || "Người dùng ẩn danh"}</h6>
                          <StarRatings
                            rating={item?.star || 0}
                            numberOfStars={5}
                            starRatedColor="#ffd700"
                            starDimension="20px"
                            starSpacing="2px"
                            name={`rating-${index}`}
                          />
                        </div>
                        <p className="mt-3">{item?.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Chưa có đánh giá nào.</p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </Container>
        <Container class1="popular-wapper home-wapper-2 mb-5">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our Popular Products</h3>
            </div>
            <div className="row">
              <ProductCard data = {otherProducts} />
            </div>
          </div>
        </Container>
      </Container>
    </>
  );
};

export default SingleProduct;
