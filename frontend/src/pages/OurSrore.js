import React, { useEffect, useState, useCallback,useRef  } from "react";
import { useLocation } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsWithMeta,
  getColors,
  getAllCateogoryProduct,
} from "../features/product/productSlice";
import { FaSpinner } from "react-icons/fa";
import {
  MdViewAgenda,
  MdViewStream,
  MdViewModule,
  MdGridView,
} from "react-icons/md";
import SidebarFilter from "../components/SidebarFilter";

const GRID_OPTIONS = [12, 6, 4, 3];
const ICONS = [MdViewAgenda, MdViewStream, MdViewModule, MdGridView];

const OurStore = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const [grid, setGrid] = useState(4);
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
    tag: null,
  });

  const colors = useSelector((state) => state.product.colors);
  const productCategories = useSelector((state) => state.product.productCategory);

  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);  
  
  const loadProducts = useCallback(
    async (pageNumber = 1, append = true) => {
      if (loadingRef.current) return;
      setLoading(true);
      try {
        const query = {
          page: pageNumber,
          limit: 20,
          ...(filters.category && { category: filters.category }),
          ...(filters.tag && { tags: filters.tag }),
          ...(filters.inStock && !filters.outOfStock && { inStock: true }),
          ...(!filters.inStock && filters.outOfStock && { inStock: false }),
          ...(filters.priceFrom && { "price[gte]": filters.priceFrom }),
          ...(filters.priceTo && { "price[lte]": filters.priceTo }),
          ...(filters.colors.length > 0 && { color: filters.colors }), 
          ...(searchQuery && { title: searchQuery }),
        }; 
        console.log(query);
        const response = await dispatch(getProductsWithMeta(query)).unwrap();
  
        setProducts((prevProducts) =>
          pageNumber === 1 || !append ? response.products : [...prevProducts, ...response.products]
        );
        setPage(response.currentPage || pageNumber);
        setTotalPages(response.totalPages || 1);
        setInStockCount(response.inStockCount || 0);
        setOutOfStockCount(response.outOfStockCount || 0);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, filters, searchQuery]
  );
  

  const fetchFilterData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(getAllCateogoryProduct()).unwrap(),
        dispatch(getColors()).unwrap(),
      ]);
    } catch (error) {
      console.error("Failed to fetch filter data", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);
 
  useEffect(() => {
    loadProducts(1, false);
  }, [filters, searchQuery, loadProducts]);

  // Scroll load thêm
  const handleScroll = useCallback(() => {
    if (loading) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.offsetHeight;

    if (scrollTop + windowHeight >= docHeight - 100 && page < totalPages) {
      loadProducts(page + 1);
    }
  }, [loading, page, totalPages, loadProducts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  
  // Các hàm xử lý filter giữ nguyên
  const handleCategoryClick = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category.title ? null : category.title,
    }));
  };

  const handleTagClick = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tag: prev.tag === tag ? null : tag,
    }));
  };

  const handleStockChange = (stockType) => {
    setFilters((prev) => ({
      ...prev,
      inStock: stockType === "inStock" ? !prev.inStock : false,
      outOfStock: stockType === "outOfStock" ? !prev.outOfStock : false,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,  // cập nhật priceFrom hoặc priceTo
    }));
  };
  

  const handleColorClick = (color) => {
    setFilters((prev) => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const getRandomProducts = (arr, count) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomProducts = getRandomProducts(products, 2);

  return (
    <>
      <Meta title="Cửa hàng" />
      <BreadCrumb title={searchQuery ? `Cửa hàng / ${searchQuery}` : "Cửa hàng"} />
      <Container class1="store-wapper py-5 home-wapper-2">
        <div className="row">
          <div className="col-3">
            <SidebarFilter
              categories={productCategories}
              filters={filters}
              handleCategoryClick={handleCategoryClick}
              handleStockChange={handleStockChange}
              handlePriceChange={handlePriceChange}
              handleColorClick={handleColorClick}
              handleTagClick={handleTagClick}
              inStockCount={inStockCount}
              outOfStockCount={outOfStockCount}
              uniqueColors={colors}
              randomProducts={randomProducts}
            />
          </div>
          <div className="col-9">
            <div className="filter-sort-gird mb-4">
              <div className="d-flex align-items-center justify-content-between gap-10">
                <p className="m-0 totalproducts" style={{ fontWeight: "700", fontSize: "12px" }}>
                  {products.length} sản phẩm
                </p>
                <div className="d-flex align-items-center gap-10">
                  {GRID_OPTIONS.map((value, index) => {
                    const Icon = ICONS[index];
                    return (
                      <Icon
                        key={value}
                        size={24}
                        onClick={() => setGrid(value)}
                        style={{
                          cursor: "pointer",
                          color: grid === value ? "#000" : "rgba(0,0,0,0.7)",
                          transform: value === 6 ? "rotate(90deg)" : "none",
                        }}
                        title={`Hiển thị ${value} cột`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="product-list pb-5">
              <div className="row">
                {products.length === 0 && !loading ? (
                  <p>Không có sản phẩm nào phù hợp</p>
                ) : (
                  <>
                    <ProductCard data={products} grid={grid} />
                    {loading && (
                        <div className="w-100 text-center mt-3"> 
                          <FaSpinner className="spinner" style={{fontSize: "40px", color: "#333", animation: "spin 1s linear infinite"}} />
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
