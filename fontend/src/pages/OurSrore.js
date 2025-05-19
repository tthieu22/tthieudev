import React, { useEffect, useState,useCallback,useRef } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import StarRatings from "react-star-ratings";
import ProductCard from "../components/ProductCard";
import Container from "../components/Container";
import { useDispatch } from "react-redux";
import {  getProductsWithMeta } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { MdViewAgenda, MdViewStream, MdViewModule, MdGridView } from "react-icons/md";
const OurStore = () => {
  const [grid, setGrid] = useState(4);
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: null,
    inStock: false,
    outOfStock: false,
    priceFrom: "",
    priceTo: "",
    colors: [],
    tags: [],
  });
  const loadingRef = useRef(false);

  const loadProducts = useCallback(async (pageNumber) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true); 
    try {
      const response = await dispatch(getProductsWithMeta({ page: pageNumber, limit: 20 })).unwrap();
      setProducts((prev) => (pageNumber === 1 ? response.products : [...prev, ...response.products]));
   
      setPage(response.currentPage || pageNumber);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      loadingRef.current = false;
      setTimeout(() => {
        setLoading(false);
      }, 2000); 
    }
  }, [dispatch]);
   
  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const handleScroll = useCallback(() => {
    if (loading) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.offsetHeight;

    if (scrollTop + windowHeight >= docHeight - 100) {
      if (page < totalPages) {
        loadProducts(page + 1);
      }
    }
  }, [loading, page, totalPages, loadProducts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const safeProductList = products;


  const categories = [...new Set(safeProductList.map((item) => item?.category))];
  const uniqueColors = [
    ...new Set(safeProductList.flatMap((product) => product?.color || [])),
  ]; 
  
  const uniqueTags = [
    ...new Set(safeProductList.flatMap((product) => product?.tags || [])),
  ];

  const inStockCount = safeProductList.filter(p => p.quantity > 0).length;
  const outOfStockCount = safeProductList.filter(p => p.quantity === 0).length;
  const handleCategoryClick = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === cat ? null : cat,
    }));
  };

  const handleStockChange = (type) => {
    setFilters((prev) => {
      if (type === "inStock") {
        return { ...prev, inStock: !prev.inStock };
      }
      if (type === "outOfStock") {
        return { ...prev, outOfStock: !prev.outOfStock };
      }
      return prev;
    });
  };

  const handlePriceChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleColorClick = (color) => {
    setFilters((prev) => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
  };

  const handleTagClick = (tag) => {
    setFilters((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };
  
  // Lọc sản phẩm dựa trên filters
  const filteredProducts = safeProductList.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.inStock && filters.outOfStock) {
      // Chọn cả còn hàng và hết hàng -> không lọc
    } else if (filters.inStock) {
      if (product.quantity <= 0) return false;
    } else if (filters.outOfStock) {
      if (product.quantity > 0) return false;
    }

    if (filters.priceFrom && Number(product.price) < Number(filters.priceFrom))
      return false;
    if (filters.priceTo && Number(product.price) > Number(filters.priceTo))
      return false;

    if (filters.colors.length > 0) {
      if (!product.color?.some((c) => filters.colors.includes(c))) return false;
    }

    if (filters.tags.length > 0) {
      if (!product.tags?.some((t) => filters.tags.includes(t))) return false;
    }

    return true;
  });
  const getRandomProducts = (products, count) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const randomProducts = getRandomProducts(safeProductList, 2);
  
  return (
    <>
      <Meta title={"Cửa hàng"} />
      <BreadCrumb title="Cửa hàng" />
      <Container class1="store-wapper py-5 home-wapper-2">
        <div className="row">
          <div className="col-3">
            <div className="sticky">
              <div className="filter-card mb-3">
                <h3 className="filter-title">Sắp xếp theo danh mục</h3>
                <ul className="ps-0 mb-0">
                  {categories.map((cat, index) => (
                    <li
                      key={index}
                      onClick={() => handleCategoryClick(cat)}
                      style={{
                        cursor: "pointer",
                        fontWeight: filters.category === cat ? "bold" : "normal",
                        textDecoration:
                          filters.category === cat ? "underline" : "none",
                      }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Lọc theo</h3>
                <h5 className="sub-title">Tình trạng</h5>
                <div className="form-check d-flex gap-10 align-items-center" >
                  <input
                    type="checkbox"
                    className="form-check-input p-0"
                    id="instock"
                    checked={filters.inStock}
                    onChange={() => handleStockChange("inStock")}
                  />
                  <label
                    htmlFor="instock"
                    className="form-check-label"
                    style={{ fontWeight: "bold", fontSize: "12px" }}
                  >
                    Còn hàng ({inStockCount})
                  </label>
                </div>

                <div className="form-check d-flex gap-10 align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input p-0"
                    id="outofstock"
                    checked={filters.outOfStock}
                    onChange={() => handleStockChange("outOfStock")}
                  />
                  <label
                    htmlFor="outofstock"
                    className="form-check-label"
                    style={{ fontWeight: "bold", fontSize: "12px" }}
                  >
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
                      value={filters.priceFrom}
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
                      value={filters.priceTo}
                      onChange={handlePriceChange}
                      min="0"
                    />
                    <label htmlFor="priceTo">Đến</label>
                  </div>
                </div>
                <h5 className="sub-title mt-4">Màu sắc</h5>
                <div className="product-tags d-flex gap-10 align-items-center flex-wrap">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {uniqueColors.map((color, index) => (
                      <span
                        key={index}
                        className="badge rounded-circle"
                        style={{
                          backgroundColor: color,
                          width: "25px",
                          height: "25px",
                          display: "inline-block",
                          marginBottom: "5px",
                          border: filters.colors && filters.colors.includes(color)
                            ? "3px solid #000"
                            : "1px solid #333",
                          cursor: "pointer",
                        }}
                        title={color}
                        onClick={() => handleColorClick(color)}
                      />
                    ))}
                  </div> 
                </div>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Thẻ sản phẩm</h3>
                <div className="product-tags d-flex gap-10 align-items-center flex-wrap">
                  {uniqueTags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge bg-light text-secondary rounded-3 py-2 px-3"
                      style={{
                        cursor: "pointer",
                        fontWeight: filters.tags.includes(tag) ? "bold" : "normal",
                        textDecoration: filters.tags.includes(tag)
                          ? "underline"
                          : "none",
                      }}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Sản phẩm ngẫu nhiên</h3>
                {randomProducts.map((item, index)  => (
                  <div key={index} className="random-product d-flex mb-2 gap-10">
                    <div style={{ width: "100px" }}>
                      <img
                        src={item.images?.[0]?.url || "images/placeholder.jpg"}
                        alt={item.title}
                        className="img-fluid"
                      />
                    </div>
                    <div className="w-100 d-flex flex-column justify-content-between">
                      <h5 className="mb-0"><Link to={`/product/${item._id}`} className="text-dark">{item.title}</Link></h5>
                      <StarRatings
                        rating={item.totalRating || 4}
                        starRatedColor="#ffd700"
                        numberOfStars={5}
                        starDimension="12px"
                        starSpacing="2px"
                      />
                      <p style={{ fontWeight: "bold" }} className="mb-0">
                        {item?.price
                          ? Number(item.price).toLocaleString("vi-VN") + " ₫"
                          : "Đang cập nhật giá"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="filter-sort-gird mb-4"> 
              <div className="d-flex align-items-center justify-content-between gap-10">
                <p className="m-0 totalproducts" style={{ fontWeight: "700", fontSize: "12px" }}>
                  {filteredProducts.length} sản phẩm
                </p>
                <div className="d-flex align-items-center gap-10">
                  {[12, 6, 4, 3].map((value, index) => {
                    const icons = [MdViewAgenda, MdViewStream, MdViewModule, MdGridView];
                    const Icon = icons[index];
                    return (
                      <Icon
                        key={value}
                        size={24}
                        onClick={() => setGrid(value)}
                        style={{ cursor: "pointer", color: grid === value ? "#000" : "rgb(0 0 0 / 70%)" , transform: value === 6 ? "rotate(90deg)" : "none"}}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="product-list pb-5">
              <div className="row">
                {filteredProducts.length === 0 ? (
                  <p>Không có sản phẩm nào phù hợp</p>
                ) : (
                  <>
                    <ProductCard data={filteredProducts} grid={grid} />
                    {loading && (
                      <div className="w-100 text-center mt-3">
                        <FaSpinner className="spinner-icon" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default OurStore;
