import { useEffect, useState, useMemo } from "react";
import { Table, Input, Select, Button, Row, Col, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteaProduct } from "../features/product/productClice";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import CustomModal from "../components/CustomModal";
import { toast } from "react-toastify";

const { Option } = Select;

const Productlist = () => {
  const dispatch = useDispatch();
  const productStateRaw = useSelector((state) => state.product.products || []);
  const productState = useMemo(() => productStateRaw, [productStateRaw]);

  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");

  const [searchTitle, setSearchTitle] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");

  const categories = useMemo(() => {
    const unique = new Set(productState.map((p) => p.category));
    return [...unique];
  }, [productState]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const showModal = (id) => {
    setOpen(true);
    setProductId(id);
  };

  const hideModal = () => setOpen(false);

  const handleDeleteProduct = (id) => {
    setOpen(false);
    dispatch(deleteaProduct(id))
      .unwrap()
      .then(() => {
        toast.success("Xoá sản phẩm thành công!");
        dispatch(getProducts());
      })
      .catch(() => {
        toast.error("Xoá sản phẩm thất bại!");
      });
  };

  const filteredData = productState
    .filter((product) =>
      product.title.toLowerCase().includes(searchTitle.toLowerCase().trim())
    )
    .filter((product) =>
      filteredCategory ? product.category === filteredCategory : true
    )
    .map((product, index) => ({
      key: product._id,
      index: index + 1,
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
          <Button
            type="text"
            danger
            onClick={() => showModal(product._id)}
            icon={<MdDeleteForever className="fs-5" />}
          />
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
      sorter: (a, b) => a.color.localeCompare(b.color),
      render: (color) => (
        <div>
        {color.map((color, idx) => (
          <div
            key={idx}
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: color,
                border: "1px solid #ccc",
                borderRadius: 4,
                marginRight: 8,
              }}
            />
            <span>{color}</span>
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

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", borderRadius: 6 }}>
      <h3 className="mb-4 title">Quản lý sản phẩm</h3>

      {/* Filter bar */}
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

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        rowKey="key"
        bordered
        scroll={{ x: "max-content" }}
      />

      {/* Modal xác nhận xoá */}
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteProduct(productId)}
        title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
        btnTitle="Xóa sản phẩm"
        performActionBtn="Xóa sản phẩm"
      />
    </div>
  );
};

export default Productlist;
