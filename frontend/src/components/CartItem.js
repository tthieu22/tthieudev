// CartItem.jsx
import React from "react";

const CartItem = ({ item }) => {
  return (
    <div className="d-flex gap-3 align-items-center border-bottom py-3">
      <div className="position-relative" style={{ width: "80px", height: "80px" }}>
        <img
          src={item.product?.images?.[0]?.url || ""}
          alt={item.product?.title}
          className="img-fluid rounded border shadow-sm"
        />
        <span className="position-absolute top-0 end-0 badge bg-secondary rounded-circle">
          {item.quantity}
        </span>
      </div>
      <div className="flex-grow-1 d-flex flex-column">
        <h6 className="mb-1 fw-bold">{item.product?.title}</h6>
        <p
          className="color"
          style={{
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            margin:0
          }}
        >
          Màu sắc:
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              backgroundColor: item.color?.title || "transparent",
              borderRadius: "50%",
              border: "1px solid #ccc"
            }}
          ></span>
          {item.color?.title || "N/A"}
        </p>
      </div>
      <div>
        <span className="text-dark fw-bold">
          {(item.price * item.quantity).toLocaleString("en-US", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
