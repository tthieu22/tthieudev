import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import {
  getCartUser,
  updateCartItemQuantity,
  deleteCartItem,
  resetStatus,
  emptyCartAction
} from "../features/user/userSlice";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const useDebounce = (callback, delay = 500) => {
  const timeoutRef = useRef({});

  const debouncedFunction = useCallback(
    (id, ...args) => {
      if (timeoutRef.current[id]) {
        clearTimeout(timeoutRef.current[id]);
      }
      timeoutRef.current[id] = setTimeout(() => {
        callback(id, ...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedFunction;
};

const Cart = () => {
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  const getCart = useSelector((state) => state.auth.getCart);
  const { isSuccess, updateQuantityItem, removeItem, emptyCart } = useSelector(
    (state) => state.auth
  );

  const items = useMemo(() => {
    return Array.isArray(getCart?.items)
      ? getCart.items.filter((item) => item.product && item.color)
      : [];
  }, [getCart?.items]);

  useEffect(() => {
    dispatch(getCartUser()).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && updateQuantityItem) {
      toast.success("Cập nhật số lượng thành công");
      dispatch(resetStatus());
    }
    if (isSuccess && removeItem) {
      toast.success("Xóa sản phẩm thành công");
      dispatch(resetStatus());
    }
    if (isSuccess && emptyCart) {
      toast.success("Đã xóa toàn bộ giỏ hàng");
      dispatch(resetStatus());
    }
  }, [isSuccess, updateQuantityItem, removeItem, emptyCart, dispatch]);

  useEffect(() => {
    const initialQty = {};
    items.forEach((item) => {
      initialQty[`${item.product._id}-${item.color._id}`] = item.quantity;
    });
    setQuantities(initialQty);
  }, [items]);

  const handleQtyChange = useDebounce((productId, newQty, colorId) => {
    dispatch(updateCartItemQuantity({ productId, quantity: newQty, colorId })).then(() => {
      dispatch(getCartUser());
    });
  }, 500);
  const handleDeleteItem = useDebounce(async (productId, colorId) => {
    try {
      setLoading(true);
      await dispatch(deleteCartItem({ productId, colorId }));
      await dispatch(getCartUser());
    } finally {
      setLoading(false);
    }
  }, 500);
  
  const handleEmptyCart = async () => {
    try {
      setLoading(true);
      await dispatch(emptyCartAction());
      await dispatch(getCartUser());
    } finally {
      setLoading(false);
    }
  };
  
  const onQuantityChange = (productId, colorId, e) => {
    const newQty = Math.max(1, parseInt(e.target.value) || 1);
    const selectedItem = items.find(
      (item) => item.product._id === productId && item.color._id === colorId
    );
    if (selectedItem) {
      const availableQty = selectedItem.product.quantity - selectedItem.product.sold;
      const updatedQty = Math.min(newQty, availableQty);
      setQuantities((prev) => ({
        ...prev,
        [`${productId}-${colorId}`]: updatedQty,
      }));
      handleQtyChange(productId, updatedQty, colorId);
    }
  };

  if (loading) {
    return (
      <>  
        <Meta title="Giỏ hàng" />
        <BreadCrumb title="Giỏ hàng" />
        <div className="loading-spinner d-flex align-items-center justify-content-center" style={{textAlign: "center", padding: "50px" , height: "100vh" ,backgroundColor:" var(--color-f5f5f7)"}}>
          <FaSpinner className="spinner" style={{fontSize: "40px", color: "#333", animation: "spin 1s linear infinite"}} />
        </div>
      </>
    );
  }

  return (
    <>
      <Meta title="Giỏ hàng" />
      <BreadCrumb title="Giỏ hàng" />
      <Container class1="cart-wrapper home-wrapper-2 pb-5">
        <div className="d-flex flex-column cart-item-container justify-content-between">
          <div className="cart-container">
            {items.length > 0 && (
              <div className="cart-header d-flex justify-content-between align-items-center">
                <h6 className="cart-col-1 fw-bold fs-6">Product</h6>
                <h6 className="cart-col-2 fw-bold fs-6">Price</h6>
                <h6 className="cart-col-3 fw-bold fs-6">Quantity</h6>
                <h6 className="cart-col-4 fw-bold fs-6">Total</h6>
              </div>
            )}

            {items.length > 0 ? (
              items.map((item, index) => {
                const { product, price, color } = item;
                if (!product || !color) return null;

                const productId = product._id;
                const colorId = color._id;
                const quantity = item.quantity;
                const key = `${productId}-${colorId}`;

                return (
                  <div
                    className="cart-data d-flex justify-content-between align-items-center py-3"
                    key={key}
                  >
                    <div className="cart-col-1 gap-15 d-flex align-items-center">
                      <div className="box-img">
                        <img
                          src={product.images?.[0]?.url || "/images/default.jpg"}
                          alt={product.title || "Product"}
                          className="img-fluid w-100"
                        />
                      </div>
                      <div className="content-item">
                        <h6 className="title fw-bold">{product.title}</h6>
                        <p
                          className="color"
                          style={{
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          Màu sắc:
                          <span
                            style={{
                              display: "inline-block",
                              width: "14px",
                              height: "14px",
                              backgroundColor: color?.title || "transparent",
                              borderRadius: "50%",
                              border: "1px solid #ccc"
                            }}
                          ></span>
                          {color?.title || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="cart-col-2">
                      <h6 className="price fw-bold">{price.toLocaleString()}đ</h6>
                    </div>
                    <div className="cart-col-3">
                      <div className="d-flex gap-15 align-items-center">
                        <input
                          type="number"
                          className="form-control w-50"
                          value={quantities[key] || quantity}
                          onChange={(e) => onQuantityChange(productId, colorId, e)}
                          min={1}
                          max={product.quantity - product.sold}
                        />
                        <MdDelete
                          className="fs-3 text-danger"
                          role="button"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteItem(productId, colorId)}
                        />
                      </div>
                    </div>
                    <div className="cart-col-4">
                      <h6 className="total-price fw-bold text-dark">
                        {(price * quantity).toLocaleString()}đ
                      </h6>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-3">
                  <div className="loading-spinner d-flex align-items-center justify-content-center" style={{textAlign: "center", padding: "50px" , height: "70vh"}}>
                    <h5>Không có sản phẩm nào trong giỏ hàng.</h5>
                </div>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="cart-subtotal d-flex justify-content-between">
              <div>
                <Link to="/store/" className="btn button">
                  Tiếp tục mua hàng
                </Link>
              </div>
              <div className="d-flex flex-column align-items-end">
                <button className="button mb-2" onClick={handleEmptyCart}>
                  Xóa toàn bộ giỏ hàng
                </button>
                <h5 className="mt-3 fw-bold fs-5" style={{ fontSize: "16px" }}>
                  Tổng phụ: {getCart.cartTotal?.toLocaleString() || 0}đ
                </h5>
                <p className="text-muted">
                  Thuế và phí vận chuyển được tính khi thanh toán
                </p>
                <Link to={"/checkout"} className="button">
                  Thanh toán 
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default Cart;
