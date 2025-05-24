import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Color from "../components/Color";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  getAllCompare,
  addToCompare,
  resetStatusCompare,
} from "../features/compare/compareSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CompareProduct = () => {
  const dispatch = useDispatch();
  const [load, setLoad] = useState(true);
  const [isClickAddCompare, setIsClickAddCompare] = useState(false);
  const compareState = useSelector((state) => state?.compare) || {};
  const { compareList = [], isAddCompare = null, message = "" } = compareState;

  useEffect(() => {
    if (load) {
      dispatch(getAllCompare());
      setLoad(false);
    }
  }, [dispatch, load]);

  const handleAddToCompare = (id) => {
    dispatch(addToCompare(id));
    setIsClickAddCompare(true);
    dispatch(resetStatusCompare());
  };

  useEffect(() => {
    if (!isClickAddCompare) return;

    if (isAddCompare === true) {
      toast.success("Thành công");
    } else if (isAddCompare === false) {
      toast.info("Lỗi thêm vào danh sách so sánh");
    }

    setIsClickAddCompare(false);
  }, [isAddCompare, message, isClickAddCompare]);

  const formatPriceVND = (price) =>
    price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const isCompared = (id) => compareList.some((item) => item._id === id);
  console.log(compareList);
  
  return (
    <>
      <Meta title="So sánh sản phẩm" />
      <BreadCrumb title="So sánh sản phẩm" />
      <Container
        class1="compare-product-wrapper py-3 mb-5 pb-5 home-wrapper-2"
        style={{ minHeight: "100vh" }}
      >
        <div className="row g-4">
          {compareList.length === 0 ? (
            
            <div className="py-3">
                  <div className="loading-spinner d-flex align-items-center justify-content-center" style={{textAlign: "center", padding: "50px" , height: "70vh"}}>
                    <h5>Không có sản phẩm để so sánh.</h5>
                </div>
              </div>
          ) : (
            compareList.map((item) => (
              <div className="col-md-3 col-sm-6" key={item._id}>
                <div className="compare-product-card position-relative shadow-lg p-3 rounded bg-white " style={{ minHeight: "400px" }}>
                  <AiOutlineCloseCircle
                    className="position-absolute"
                    size={24}
                    color="#dc3545"
                    style={{ top: 0, right: 0, cursor: "pointer" ,zIndex: 1}}
                    onClick={() => handleAddToCompare(item._id)}
                  />
                  <div className="product-card-images mb-2 text-center position-relative">
                    <Link to={`/product/${item._id}`}>
                      <img
                        src={item.images?.[0]?.url || "/images/default.png"}
                        alt={item.title}
                        className="img-fluid"
                        style={{ width: "100%", objectFit: "contain" , borderRadius: "8px" ,border: "1px solid #ddd"}}
                      />
                    </Link>
                    
                    {isCompared(item._id) && (
                        <span
                          className="badge bg-success m-3 mx-2 position-absolute top-0" style={{ left: 0 }} 
                        >
                          {item.tags[0] || "Đã so sánh"}
                        </span>
                      )}
                  </div>
                  <div className="compare-product-detail text-dark small">
                    <h6 className="fw-semibold mb-2 text-bold" style={{ minHeight: "48px" }}>
                      {item.title}
                    </h6>
                    <p className="text-danger fw-bold mb-3">
                      {formatPriceVND(item.price)}
                    </p>
                  </div>
                  {item.brand && (
                    <div className="product-detail text-muted small">
                      <strong>Thương hiệu:</strong> {item.brand}
                    </div>
                  )}
                  {item.category && (
                    <div className="product-detail text-muted small">
                      <strong>Loại:</strong> {item.category}
                    </div>
                  )}
                  {item.quantity !== undefined && (
                    <div className="product-detail text-muted small">
                      <strong>Tình trạng:</strong>{" "}
                      {item.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                    </div>
                  )}
                  {item.color?.length > 0 && (
                    <div className="product-detail text-muted small">
                      <strong>Màu sắc:</strong> <Color prop={item.color} />
                    </div>
                  )}
                  {item.size?.length > 0 && (
                    <div className="product-detail text-muted small">
                      <strong>Kích thước:</strong>
                      <div className="d-flex gap-2 flex-wrap mt-1">
                        {item.size.map((sz, i) => (
                          <span
                            key={i}
                            className="badge bg-secondary-subtle text-dark border rounded px-2 py-1"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
    </>
  );
};

export default CompareProduct;
