import React from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

const SidebarFilter = ({
  categories = [],
  filters = {},
  handleCategoryClick,
  handleStockChange,
  handlePriceChange,
  handleColorClick,
  handleTagClick,
  inStockCount = 0,
  outOfStockCount = 0,
  uniqueColors = [],
  randomProducts = [],
}) => {
  const {
    category = "",
    inStock = false,
    outOfStock = false,
    priceFrom = "",
    priceTo = "",
    colors = [],
    tags = [],
  } = filters;

  return (
    <div className="sticky">
      {/* DANH MỤC */}
      <div className="filter-card mb-3">
        <h3 className="filter-title">Sắp xếp theo danh mục</h3>
        <ul className="ps-0 mb-0">
          {categories.map((cat) => (
            <li
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              style={{
                cursor: "pointer",
                fontWeight: category === cat.title ? "bold" : "normal",
                textDecoration: category === cat.title ? "underline" : "none",
              }}
            >
              {cat.title}
            </li>
          ))}
        </ul>
      </div>

      {/* TÌNH TRẠNG VÀ GIÁ */}
      <div className="filter-card mb-3">
        <h3 className="filter-title">Lọc theo</h3>
        <h5 className="sub-title">Tình trạng</h5>

        <div className="form-check d-flex gap-10 align-items-center">
          <input
            type="checkbox"
            className="form-check-input p-0"
            id="instock"
            checked={inStock}
            onChange={() => handleStockChange("inStock")}
          />
          <label htmlFor="instock" className="form-check-label" style={{ fontWeight: "bold", fontSize: "12px" }}>
            Còn hàng ({inStockCount})
          </label>
        </div>

        <div className="form-check d-flex gap-10 align-items-center">
          <input
            type="checkbox"
            className="form-check-input p-0"
            id="outofstock"
            checked={outOfStock}
            onChange={() => handleStockChange("outOfStock")}
          />
          <label htmlFor="outofstock" className="form-check-label" style={{ fontWeight: "bold", fontSize: "12px" }}>
            Hết hàng ({outOfStockCount})
          </label>
        </div>

        <h5 className="sub-title mt-3">Giá</h5>
        <div className="d-flex align-items-center gap-10">
          <div className="form-floating">
            <input
              type="number"
              className="form-control"
              id="priceFrom"
              placeholder="Từ"
              name="priceFrom"
              value={priceFrom}
              onChange={handlePriceChange}
              min="0"
            />
            <label htmlFor="priceFrom">Từ</label>
          </div>
          <div className="form-floating">
            <input
              type="number"
              className="form-control"
              id="priceTo"
              placeholder="Đến"
              name="priceTo"
              value={priceTo}
              onChange={handlePriceChange}
              min="0"
            />
            <label htmlFor="priceTo">Đến</label>
          </div>
        </div>
      </div>

      {/* MÀU SẮC */}
      <div className="filter-card mb-3">
        <h3 className="filter-title">Màu sắc</h3>
        <ul className="colors ps-0">
          {uniqueColors.map((color) => (
            <li
              key={color._id}
              title={color.title}
              onClick={() => handleColorClick(color.title)}
              style={{
                backgroundColor: color.title,
                border: colors.includes(color.title) ? "2px solid #000" : "1px solid #ccc",
                cursor: "pointer",
              }}
            />
          ))}
        </ul>
      </div>

      <div className="filter-card mb-3">
        <h3 className="filter-title">Thẻ sản phẩm</h3>
        <div className="product-tags d-flex gap-10 align-items-center flex-wrap">
            {["Popular", "Featured", "SUPPERCHARGED", "Famous", "Sale"].map(
            (tag, index) => (
                <span
                key={index}
                className="badge bg-light text-secondary rounded-3 py-2 px-3"
                style={{
                    cursor: "pointer",
                    fontWeight: tags.includes(tag) ? "bold" : "normal",
                    textDecoration: tags.includes(tag) ? "underline" : "none",
                }}
                onClick={() => handleTagClick(tag)}
                >
                {tag}
                </span>
            )
            )}
        </div>
      </div>

      {/* SẢN PHẨM NGẪU NHIÊN */}
      <div className="filter-card mb-3">
        <h3 className="filter-title">Sản phẩm ngẫu nhiên</h3>
        {randomProducts.map((item) => (
          <div key={item._id} className="random-products mb-3 d-flex">
            <div className="w-50">
              <Link to={`/product/${item._id}`}>
                <img src={item?.images?.[0]?.url} alt={item.title} className="img-fluid" />
              </Link>
            </div>
            <div className="w-50 ps-2">
              <Link to={`/product/${item._id}`}><h5>{item.title}</h5></Link>
              <StarRatings
                rating={item.totalRating || 0}
                starRatedColor="#ffb800"
                numberOfStars={5}
                name="rating"
                starDimension="14px"
                starSpacing="0px"
              />
              <b>{item.price.toLocaleString()}₫</b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarFilter;
