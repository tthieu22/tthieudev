import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import { getCartUser, updateCartItemQuantity, deleteCartItem ,resetStatus } from "../features/user/userSlice";
import { toast } from "react-toastify";

const useDebounce = (callback, delay = 500) => {
  const timeoutRef = useRef({});

  const debouncedFunction = useCallback((id, ...args) => {
    if (timeoutRef.current[id]) {
      clearTimeout(timeoutRef.current[id]);
    }
    timeoutRef.current[id] = setTimeout(() => {
      callback(id, ...args);
    }, delay);
  }, [callback, delay]);

  return debouncedFunction;
};

const Cart = () => {
  const dispatch = useDispatch();
  const [loadCart, setLoadCart] = useState(true);
  const [quantities, setQuantities] = useState({});
  
  const getCart = useSelector((state) => state.auth.getCart);
  const items = useMemo(() => Array.isArray(getCart?.items) ? getCart.items : [], [getCart?.items]);
  const { isSuccess, updateQuantityItem, removeItem, emptyCart, } = useSelector((state) => state.auth);
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
    if (loadCart) {
      dispatch(getCartUser());
      setLoadCart(false);
    }
  }, [dispatch, loadCart]);

  useEffect(() => {
    const initialQty = {};
    items.forEach((item) => {
      initialQty[item.product._id] = item.quantity;
    });
    setQuantities(initialQty);
  }, [items]);

  const handleQtyChange = useDebounce((productId, newQty, colorId) => {
    dispatch(updateCartItemQuantity({ productId: productId, quantity: newQty, colorId: colorId }));
    setLoadCart(true);
  }, 500);

  const handleDeleteItem = useDebounce((productId, colorId) => {
    dispatch(deleteCartItem({ productId: productId, colorId: colorId }));
    setLoadCart(true); 
    console.log(productId, colorId);
  }, 500);

  const onQuantityChange = (productId, colorId, e) => {
    const newQty = Math.max(1, parseInt(e.target.value) || 1);
    const selectedItem = items.find((item) => item.product._id === productId && item.color._id === colorId);

    if (selectedItem) {
      const availableQty = selectedItem.product.quantity - selectedItem.product.sold;
      const updatedQty = Math.min(Math.max(newQty, 1), availableQty); 
      setQuantities((prev) => ({
        ...prev,
        [`${productId}-${colorId}`]: updatedQty,
      }));

      handleQtyChange(productId, updatedQty , colorId);
    }
  };

  return (
    <>
      <Meta title="Cart" />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 pb-5">
        <div className="row">
          <div className="col-12">
            <div className="cart-header d-flex justify-content-between align-items-center">
              <h6 className="cart-col-1">Product</h6>
              <h6 className="cart-col-2">Price</h6>
              <h6 className="cart-col-3">Quantity</h6>
              <h6 className="cart-col-4">Total</h6>
            </div>

            {items.length > 0 ? (
              items.map((item, index) => {
                const { product, price, color } = item;
                const productId = product?._id;
                const colorId = color?._id;
                const quantity = item?.quantity;

                return (
                  <div
                    className="cart-data d-flex justify-content-between align-items-center py-3"
                    key={index}
                  >
                    <div className="cart-col-1 gap-15 d-flex align-items-center">
                      <div className="box-img">
                        <img
                          src={product?.images?.[0]?.url || "/images/default.jpg"}
                          alt={product?.title}
                          className="img-fluid w-100"
                        />
                      </div>
                      <div className="content-item">
                        <h6 className="title text-muted" style={{ fontSize: "14px" }}>
                          {product?.title}
                        </h6>
                        <p className="color text-primary" style={{ fontSize: "12px" }}>
                          Color: {color?.title || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="cart-col-2">
                      <h6 className="price text-dark" style={{ fontSize: "14px" }}>
                        {price.toLocaleString()}đ
                      </h6>
                    </div>
                    <div className="cart-col-3">
                      <div className="d-flex gap-15 align-items-center">
                        <input
                          type="number"
                          className="form-control w-50"
                          value={quantities[`${productId}-${colorId}`] || quantity}
                          onChange={(e) => onQuantityChange(productId, colorId, e)}
                          min={1}
                          max={product?.quantity - product?.sold}
                          style={{ fontSize: "14px" }}
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
                      <h6 className="total-price text-dark" style={{ fontSize: "14px" }}>
                        {(price * quantity).toLocaleString()}đ
                      </h6>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-3">
                <h6 className="text-center text-muted">Không có sản phẩm trong giỏ hàng</h6>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="col-12 py-2 d-flex justify-content-between">
              <div>
                <Link to="/store/" className="btn btn-outline-primary" style={{ fontSize: "14px" }}>
                  Continue To Shipping
                </Link>
              </div>
              <div className="d-flex flex-column align-items-end">
                <h5 className="text-dark" style={{ fontSize: "16px" }}>
                  SubTotal: {getCart.cartTotal?.toLocaleString() || 0}đ
                </h5>
                <p className="text-muted" style={{ fontSize: "12px" }}>
                  Taxes and shipping calculated at checkout
                </p>
                <Link to={"/checkout"} className="btn btn-success" style={{ fontSize: "14px" }}>
                  Checkout
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
