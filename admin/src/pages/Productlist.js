import { useEffect, useState, useMemo } from "react";
import { Table, Input, Select, Button, Row, Col, Space } from "antd";
import { useDispatch } from "react-redux";
import { getProductsWithMeta } from "../features/product/productClice";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const { Option } = Select;

const Productlist = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0); 
  const [searchTitle, setSearchTitle] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return [...unique];
  }, [products]);

  // Fetch data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await dispatch(getProductsWithMeta({ page, limit: pageSize }));  
        setProducts( response.payload.products || []);
        setTotalProducts(response.payload?.totalProducts || 0);
      } catch (error) {
        toast.error("Không thể tải sản phẩm!");
      }
    };

    fetchProducts();
  }, [dispatch, page, pageSize]);

  const filteredData = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchTitle.toLowerCase().trim())
    )
    .filter((product) =>
      filteredCategory ? product.category === filteredCategory : true
    )
    .map((product, index) => ({
      key: product._id,
      index: (page - 1) * pageSize + index + 1,
      title: product.title,
      quantity: product.quantity,
      price: `$${product.price}`,
      category: product.category,
      color: product.color,
      brand: product.brand,
      ratings: product.ratings?.length || 0,
      action: (
        <Space size="middle">
          <Link to={`/admin/product/${product._id}`} className="text-dark">
            <FaEdit className="fs-5" />
          </Link>
        </Space>
      ),
    }));

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      width: 70,
      sorter: (a, b) => a.index - b.index,
      defaultSortOrder: "ascend",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a, b) =>
        parseFloat(a.price.replace("$", "")) -
        parseFloat(b.price.replace("$", "")),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      sorter: (a, b) => a.color?.[0]?.localeCompare(b.color?.[0] || ""),
      render: (color) => (
        <div>
          {color.map((c, idx) => (
            <div
              key={idx}
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: c,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  marginRight: 8,
                }}
              />
              <span>{c}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.localeCompare(b.brand),
    },
    {
      title: "Đánh giá",
      dataIndex: "ratings",
      sorter: (a, b) => a.ratings - b.ratings,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 120,
    },
  ];

  const resetFilters = () => {
    setSearchTitle("");
    setFilteredCategory("");
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", borderRadius: 6 }}>
      <h3 className="mb-4 title">Quản lý sản phẩm</h3>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            allowClear
            enterButton
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Lọc theo danh mục"
            value={filteredCategory || undefined}
            onChange={(value) => setFilteredCategory(value)}
            allowClear
            style={{ width: "100%" }}
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={24} md={8} lg={6}>
          <Button onClick={resetFilters} block>
            Reset bộ lọc
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          current: page,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["8", "16", "32", "64"],
          total: totalProducts,
        }}
        onChange={handleTableChange}
        rowKey="key"
        bordered
        scroll={{ x: "max-content" }}
      />

    </div>
  );
};

export default Productlist;
