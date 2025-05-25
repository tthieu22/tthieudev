// src/components/RandomProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

const RandomProductCard = ({ product }) => {
  return (
    <div className="random-products mb-3 d-flex">
      <div className="w-50">
        <Link to={`/product/${product._id}`}>
          <img
            src={product?.images?.[0]?.url}
            alt={product.title}
            className="img-fluid"
          />
        </Link>
      </div>
      <div className="w-50 ps-2 d-flex flex-column">
        <Link to={`/product/${product._id}`}>
          <h5>{product.title}</h5>
        </Link>
        <StarRatings
          rating={product.totalRating || 0}
          starRatedColor="#ffb800"
          numberOfStars={5}
          name="rating"
          starDimension="14px"
          starSpacing="0px"
        />
        <b>{product.price.toLocaleString()}₫</b>
      </div>
    </div>
  );
};

export default RandomProductCard;
