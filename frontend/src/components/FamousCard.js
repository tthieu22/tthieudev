import React from "react";
import { Link } from "react-router-dom";
const FamousCard = ({ prod }) => {
  if (!prod || prod.length === 0) {
    return ;
  }

  return (
    <div className="row">
      {prod.map((product) => (
        <Link to={`/product/${product._id}`} key={product._id} className="col-6 col-md-6 col-lg-3 col-xl-3 mb-3">
          <div className="famous-card  position-relative">
            <img
              src={product.images[0]?.url || "images/famous.jpg"}
              alt={product.title || "famous"}
              className="img-fluid"
            />
            <div className="famous-content position-absolute">
              <h5 className="text-black">{product.brand || "Brand"}</h5>
              <h6 className="text-black">{product.title || "Title"}</h6>
              <p className="text-black"> Từ <span className="red-p">{ Number(product.price).toLocaleString("vi-VN") + " ₫"}</span></p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FamousCard;
