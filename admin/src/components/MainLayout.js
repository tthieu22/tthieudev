import React, { useState, useEffect, useRef } from "react";
import {
  AiFillHome,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineTag,
  AiOutlineShop,
  AiOutlineNotification, 
} from "react-icons/ai";
import { MdCategory, MdOutlineColorLens, MdOutlineArticle } from "react-icons/md";
import { RiCoupon2Fill } from "react-icons/ri";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loginuser } = useSelector((state) => state.auth );
 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const getSelectedKey = () => {
    const path = location.pathname.replace(/^\/admin\/?/, ""); 
    if (!path || path === "") return "/admin";
 
    const firstPart = path.split("/")[0];
    return firstPart;
  };
 
  const menuItems = [
    {
      key: "/admin",
      icon: <AiFillHome className="fs-4" />,
      label: "Trang Chủ",
    },
    {
      key: "customer",
      icon: <AiOutlineUser className="fs-4" />,
      label: "Khách Hàng",
    },
    {
      key: "catalog",
      icon: <AiOutlineShoppingCart className="fs-4" />,
      label: "Sản Phẩm",
      children: [
        {
          key: "product",
          icon: <AiOutlineShoppingCart />,
          label: "Thêm Sản Phẩm",
        },
        {
          key: "product-list",
          icon: <AiOutlineShoppingCart />,
          label: "Danh Sách Sản Phẩm",
        },
        {
          key: "brand",
          icon: <AiOutlineTag />,
          label: "Thương Hiệu",
        },
        {
          key: "list-brand",
          icon: <AiOutlineTag />,
          label: "Danh Sách Thương Hiệu",
        },
        {
          key: "category",
          icon: <MdCategory />,
          label: "Danh Mục",
        },
        {
          key: "list-category",
          icon: <MdCategory />,
          label: "Danh Sách Danh Mục",
        },
        {
          key: "color",
          icon: <MdOutlineColorLens />,
          label: "Màu Sắc",
        },
        {
          key: "list-color",
          icon: <MdOutlineColorLens />,
          label: "Danh Sách Màu Sắc",
        },
      ],
    },
    {
      key: "orders",
      icon: <AiOutlineShop className="fs-4" />,
      label: "Đơn Hàng",
    },
    {
      key: "blogs",
      icon: <MdOutlineArticle className="fs-4" />,
      label: "Các Bài Viết",
      children: [
        {
          key: "blog",
          icon: <MdOutlineArticle />,
          label: "Thêm Bài Viết",
        },
        {
          key: "blog-list",
          icon: <MdOutlineArticle />,
          label: "Danh Sách Bài Viết",
        },
        {
          key: "blog-category",
          icon: <MdOutlineArticle />,
          label: "Thêm Danh Mục Bài Viết",
        },
        {
          key: "blog-category-list",
          icon: <MdOutlineArticle />,
          label: "Danh Sách Danh Mục Bài Viết",
        },
      ],
    },
    {
      key: "enquiries",
      icon: <AiOutlineUser className="fs-4" />,
      label: "Yêu Cầu",
    },
    {
      key: "marketing",
      icon: <RiCoupon2Fill className="fs-4" />,
      label: "Tiếp Thị",
      children: [
        {
          key: "coupon",
          icon: <RiCoupon2Fill />,
          label: "Giảm Giá",
        },
        {
          key: "coupon-list",
          icon: <RiCoupon2Fill />,
          label: "Danh Sách Giảm Giá",
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "#001529" }}
      >
        <div
          className="logo text-center py-4 text-white fs-5 fw-bold"
          style={{ userSelect: "none" }}
        >
          {collapsed ? "dev" : "tthieu.dev.02"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={({ key }) => {
            if (key === "signout") {
              handleLogout();
            } else if (key === "/admin") {
              navigate("/admin");
            } else {
              navigate(`/admin/${key}`);
            }
          }}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "18px", width: 48, height: 48 }}
            aria-label={collapsed ? "Mở menu" : "Đóng menu"}
          />

          <div
            className="d-flex align-items-center gap-3"
            style={{ position: "relative" }}
            ref={dropdownRef}
          >
            <div
              className="position-relative"
              style={{ cursor: "pointer" }}
              aria-label="Thông báo"
              tabIndex={0}
              role="button"
              onClick={() => {
                // Xử lý click notification nếu cần
                alert("Bạn có 1 thông báo mới!");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  alert("Bạn có 1 thông báo mới!");
                }
              }}
            >
              <AiOutlineNotification size={24} />
              <span
                style={{
                  position: "absolute",
                  top: "30%",
                  right: -4,
                  width: 16,
                  height: 16,
                  backgroundColor: "#faad14",
                  color: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 10,
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                1
              </span>
            </div>

            <div
              className="d-flex align-items-center gap-2 dropdown-toggle"
              id="userDropdown"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              tabIndex={0}
              role="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setDropdownOpen(!dropdownOpen);
                }
              }}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              <img
                src={
                  loginuser?.avatar ||
                  "https://th.bing.com/th/id/OIP.SAkHnK4yt1ed4oz6SzvawAHaEH?w=309&h=180&c=7&r=0&o=5&pid=1.7"
                }
                alt="avatar"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  userSelect: "none",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // ảnh mặc định
                }}
              />
              <div className="d-flex flex-column" style={{ userSelect: "none", lineHeight: "12px" }}>
              {loginuser ? (
                <>
                  <h6 
                    className="mb-2" 
                    style={{ userSelect: "none", lineHeight: "12px" }}
                  >
                    {`${loginuser.firstname} ${loginuser.lastname}`}
                  </h6>
                  <small 
                    className="text-muted" 
                    style={{ userSelect: "none", lineHeight: "12px" }}
                  >
                    {loginuser.email}
                  </small>
                </>
              ) : (
                <p>Loading...</p>
              )}

              </div>
            </div>

            {dropdownOpen && (
              <ul
                className="dropdown-menu dropdown-menu-end show"
                aria-labelledby="userDropdown"
                style={{ minWidth: 160, position: "absolute", top: "100%", right: 0 }}
              >
                <li>
                  <Link
                    to="/admin/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Xem Hồ Sơ
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Đăng Xuất
                  </button>
                </li>
              </ul>
            )}
          </div>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
