import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { useDispatch, useSelector } from "react-redux";
import { getAWishList } from "../features/user/userSlice";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { addToWishList } from "../features/product/productSlice";
import { toast } from "react-toastify";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishliststate = useSelector((state) => state?.auth?.wishlist?.wishlist);

  useEffect(() => {
    dispatch(getAWishList());
  }, [dispatch]);

  const removeWishlistFromDb = (id) => {
    const isInWishlist = wishliststate.some((item) => item._id === id);
    dispatch(addToWishList(id));
    setTimeout(() => {
      dispatch(getAWishList());
      if (isInWishlist) {
        toast.info("Đã xóa khỏi danh sách yêu thích");
      } else {
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    }, 300);
  };

  return (
    <>
      <Meta title={"Danh sách yêu thích"} />
      <BreadCrumb title="Danh sách yêu thích" />
      <div className="wishlist-wrapper home-wapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            {wishliststate && wishliststate.length > 0 ? (
              wishliststate.map((item) => (
                <div className="col-3 mb-4" key={item._id}>
                  <div className="wishlist-card shadow rounded-3 position-relative overflow-hidden">
                    <MdClose
                      onClick={() => removeWishlistFromDb(item._id)}
                      size={24}
                      className="position-absolute"
                      style={{
                        top: 10,
                        right: 10,
                        cursor: "pointer",
                        color: "#dc3545",
                        backgroundColor: "rgba(220,53,69,0.1)",
                        borderRadius: "50%",
                        padding: "3px",
                        zIndex: 10,
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#dc3545";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.1)";
                        e.currentTarget.style.color = "#dc3545";
                      }}
                      title="Xóa khỏi danh sách yêu thích"
                    />
                    <div className="product-card-images">
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="w-100 "
                        style={{ objectFit: "cover", maxHeight: "300px" }}
                      />
                    </div>
                    <Link
                      to={`/product/${item._id}`}
                      className="px-3 py-3 bg-white d-block text-decoration-none"
                    >
                      <h5 className="title text-truncate fw-bold" title={item.title}>
                        {item.title}
                      </h5>
                      <h6 className="price text-danger"> {item.price
                        ? Number(item.price).toLocaleString("vi-VN") + " ₫"
                        : "Đang cập nhật giá"}
                      </h6>
                    </Link>
                  </div>
                </div>
              ))
            ) : ( 
              <div className="py-3">
                  <div className="loading-spinner d-flex align-items-center justify-content-center" style={{textAlign: "center", padding: "50px" , height: "70vh"}}>
                    <h5>Không có sản phẩm nào yêu thích</h5>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
