import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import StarRatings from 'react-star-ratings';
import Color from "../components/Color";
import wish from "../images/wish.svg";
import filledWish from "../images/wished.svg";
import ProductReview from "../components/ProductReview";
import { DiGitCompare } from "react-icons/di";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAproduct, addToWishList, getAllProduct } from "../features/product/productSlice";
import { getAWishList, addToCart } from "../features/user/userSlice";
import { getAllCompare, addToCompare } from "../features/compare/compareSlice";
import { FaSpinner } from "react-icons/fa";

const SingleProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.pathname.split("/").pop();

  const [productState, setProductState] = useState(null); 
  const [allProducts, setAllProducts] = useState([]);
  const [mainImage, setMainImage] = useState(""); 
  const [compared, setCompared] = useState(false); 
  const [loading, setLoading] = useState(true);
  const otherProducts = allProducts.filter((p) => p._id !== productId).slice(0, 4);

  const { wishlist } = useSelector((state) => state.auth?.wishlist || []);    
  const { isAddCompare } = useSelector((state) => state?.compare || []); 

  const [wishlistChanged, setWishlistChanged] = useState(false);
  const [compareChanged, setCompareChanged] = useState(false);
  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);
  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;
      setLoading(true); 

      const productAction = await dispatch(getAproduct(productId));
      const allProductAction = await dispatch(getAllProduct({ limit: 30 }));
      await dispatch(getAWishList());

      setProductState(productAction?.payload || null);
      setAllProducts(allProductAction?.payload || []); 

      const existingCompare = JSON.parse(localStorage.getItem("compare")) || [];
      const isAlreadyCompared = existingCompare.some(item => item._id === productId);
      setCompared(isAlreadyCompared);
      setLoading(false);
    };

    fetchData();
  }, [dispatch, productId]);

  useEffect(() => {
    if (productState?.images?.length > 0) {
      setMainImage(productState.images[0].url); 
    }
  }, [productState]);

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const schema = Yup.object().shape({
    productId: Yup.string().required(),
    quantity: Yup.number().min(1).required(),
    colorId: Yup.string().required("Hãy chọn màu sắc"),
  });

  const formik = useFormik({
    initialValues: {
      productId: productId || "",
      quantity: 1,
      colorId: "",
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      const resultAction = await dispatch(addToCart(values));
      if (addToCart.fulfilled.match(resultAction)) {
        toast.success("Thêm vào giỏ hàng thành công");
        resetForm();
      } else {
        toast.error("Thêm vào giỏ hàng thất bại. Vui lòng đăng nhập để thực hiện thao tác này", {
          onClick: () => navigate("/login"),
          autoClose: false,
        });
      }
    },
    
  });
 
  useEffect(() => {
    if (wishlistChanged && Array.isArray(wishlist)) {
      
      const isInWishlist = wishlist.some(item => item._id === productId); 
      if (isInWishlist) {
        toast.success("Đã thêm vào danh sách yêu thích");
      } else {
        toast.info("Đã xóa khỏi danh sách yêu thích");
      }
      setWishlistChanged(false);
    }
  }, [wishlist, wishlistChanged, productId]);
 
  useEffect(() => {
    if(!compareChanged) return;
    if (isAddCompare ) {
      toast.success("Đã thêm vào danh sách so sánh"); 
      setCompared(isAddCompare);
    }
    if (!isAddCompare) {
      setCompared(isAddCompare);
      toast.info("Đã xóa khỏi danh sách so sánh");
    }  
    setCompareChanged(false);
    
  }, [isAddCompare, productId , compareChanged, dispatch]);
  
  const addToWishlist = async (id) => {
    await dispatch(addToWishList(productId)); 
    await dispatch(getAWishList());
    setWishlistChanged(true);
  };

  const handleAddToCompare = async () => {
    await dispatch(addToCompare(productId)); 
    await dispatch(getAllCompare());  
    setCompareChanged(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép liên kết vào clipboard");
  };
  if (loading) {
    return (
      <> 
        <Meta title={productState?.title}></Meta>
        <BreadCrumb title={productState?.title} /> 
          <div className="loading-spinner d-flex align-items-center justify-content-center" style={{textAlign: "center", padding: "50px" , height: "70vh"}}>
            <FaSpinner className="spinner" style={{fontSize: "40px", color: "#333", animation: "spin 1s linear infinite"}} />
        </div>
      </>
    );
  }
  return ( 
    <> 
      <Meta title={productState?.title}></Meta>
      <BreadCrumb title={productState?.title} />
      <Container className="main-product-wapper home-wapper py-5">
        <div className="row">
        <div className="col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
            <div className="main-product-image">
              <img
                src={mainImage}
                alt={productState?.images?.[0]?.public_id}
                className="img-fluid"
              />
            </div>
            <Swiper
              className="other-product-images-swiper"
              modules={[Navigation]}
              spaceBetween={15}
              slidesPerView={4}
              navigation
              breakpoints={{
                1024: {
                  slidesPerView: 4,
                },
                768: {
                  slidesPerView: 4,
                },
                480: {
                  slidesPerView: 4,
                },
                0: {
                  slidesPerView: 4,
                },
              }} 
            >
              {productState?.images?.map((item, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <div
                    className="other-product-image"
                    onClick={() => handleThumbnailClick(item?.url)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={item?.url} alt="product" className="img-fluid" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
            <div className="main-product-detail">
              <div className="border-bottom">
                <h3 className="title">
                  {productState?.title}
                </h3>
                </div>
                <div className="border-bottom py-3 price">
                <div className="d-flex gap-30 align-items-center">
                  <p className="fs-3">
                  {productState?.price
                    ? Number(productState.price).toLocaleString("vi-VN") + " ₫"
                    : "Đang cập nhật giá"}
                  </p>
                  <p>
                    {productState?.originalPrice && (
                      <strike>{Number(productState?.originalPrice).toLocaleString("vi-VN") + " ₫"}</strike>
                    )}
                  </p>
                </div>
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
                    <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Color:</h3>
                      <Color
                        prop={productState?.color}
                        selectedColor={formik.values.colorId}
                        onSelect={(color) => formik.setFieldValue("colorId", color)}
                      />
                      {formik.touched.color && formik.errors.colorId && (
                        <div className="text-danger">{formik.errors.colorId}</div>
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
                    <button type="submit" onClick={formik.handleSubmit} className="button border-0">Add to Cart</button> 
                  </div>
                </div>
                <div className="d-flex gap-10 alight-items-center mt-4 mb-2 gap-30">
                  <div className="d-flex gap-10 align-items-center">
                    <div className=" text-dark fs-7" onClick={(e) => { addToWishlist(productState?._id); }}>
                      <img src={wishlist?.some((product) => product?._id === productState?._id) ? filledWish : wish} alt="wishlist" width={20} /> Wishlist
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
          <ProductReview product={productState} />
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
