import React, { useEffect,useState } from "react";
import StarRatings from 'react-star-ratings';
import { Link, useLocation ,useNavigate } from "react-router-dom";
import wish from "../images/wish.svg";
import filledWish from "../images/wished.svg"; 
import view from "../images/view.svg"; 
import { useDispatch, useSelector } from "react-redux";
import { addToWishList } from "../features/product/productSlice";
import { getAWishList } from "../features/user/userSlice";
import { toast } from "react-toastify";

const ProductCard = ({ grid, data }) => {
  let location = useLocation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [load, setLoad] = useState(true);
  const columnClasses = `col-${pathname === "/store" ? grid : 3} gr-${grid} mb-4`;
  const disdesc = ` description ${grid === 12 ? "d-block" : "d-none"}`;

  // Wishlist
  const wishliststate = useSelector((state) => state?.auth?.wishlist?.wishlist || []);
  const addToWishlist = (id) => {
    const isInWishlist = wishliststate.some((item) => item._id === id);
    dispatch(addToWishList(id));
    setTimeout(() => {
      dispatch(getAWishList());
      if (isInWishlist) {
        toast.info("Đã xóa khỏi danh sách yêu thích");
      } else if(!isInWishlist) {
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    }, 300);
  };
  
  useEffect(() => {
    if(load === false) return;
    if (pathname === "/store") {
      dispatch(getAWishList());
    }
    setLoad(false);
  }, [dispatch, pathname, load]);
  
  // Add to cart
  const handleClick = (e, newId) => {
    e.preventDefault();
    const currentPath = location.pathname;
    const newPath = `/product/${newId}`;
  
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentPath.startsWith("/product/")) {
      navigate(newPath, { replace: true });
    } else {
      navigate(newPath);
    }
  }; 
  
  // Add compare
  return (
    <>
      {data?.map((item, index) => {
        return (
          <div className={columnClasses} key={index} >
            <div className="w-100 ">
              <div className="product-card position-relative  h-100" >
                <div className="wishlist-icon position-absolute">
                  <button
                    className="border-0 bg-transparent "
                    onClick={(e) => {
                      addToWishlist(item._id);
                    }}
                  >
                    <img src={ wishliststate?.some((product) => product._id === item._id) ? filledWish : wish } alt="wishlist" width={20} />
                  </button>
                </div>
                <Link onClick={(e) => handleClick(e, item?._id)}
                  className="card-content"
                  to={
                    location.pathname.startsWith("/product") &&
                    location.pathname !== "/product"
                      ? `${location.pathname}/${item?._id}`
                      : `/product/${item?._id}`
                  }
                >
                  <div className="product-images" style={{ minHeight: "270px" }}>
                    <img
                      src={item.images[0]?.url || "fallback-image-url.jpg"}
                      alt={item?.title}
                    />
                    <img
                      src={item.images[1]?.url || item.images[0]?.url || "fallback-image-url.jpg"}
                      alt={item?.title}
                    />
                  </div>

                  {item?.quantity < 0 ? (
                    <p className="badge bg-danger m-3 position-absolute top-0 left-0">Out of stock</p>
                  ) : item?.tags?.[0] && (
                    <p className="badge bg-success m-3 position-absolute top-0 left-0">
                      {item.tags[0]}
                    </p>
                  )}
                  <div className="product-details">
                    <h6 className="brand">{item?.brand}</h6>
                    <h5 className="product-title">{item?.title}</h5>
                    <br />
                    <StarRatings
                      rating={parseFloat(item?.totalrating) || 0}
                      starRatedColor="#ffd700"
                      numberOfStars={5}
                      starDimension="15px"
                      starSpacing="2px"
                    />
                    <p
                      className={disdesc}
                      dangerouslySetInnerHTML={{ __html: item?.description }}
                    ></p>

                    <p className="price">
                      {item?.price ? Number(item.price).toLocaleString("vi-VN") + " ₫" : "Đang cập nhật giá"}</p>
                  </div>
                </Link>
                <div className="action-bar position-absolute ">
                  <div className="d-flex flex-column gap-15"> 

                    <a href={`/product/${item?._id}`} className="border-0 bg-transparent  " onClick={(e) => handleClick(e, item?._id)}>
                      <img src={view} alt="view" />
                    </a> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        ); 
      })}
    </>
  );
};

export default ProductCard;
