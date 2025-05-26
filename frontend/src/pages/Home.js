import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import ProductCard from "../components/ProductCard";
import SpecialProduct from "../components/SpecialProduct";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { services } from "../utils/Data";
import { getAllBlog } from "../features/blogs/blogSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { getAllProduct } from "../features/product/productSlice";
import BannerSection from "../components/BannerSection";
import BrandMarquee from "../components/BrandMarquee";
import FamousCard from "../components/FamousCard";
import { FaSpinner } from "react-icons/fa"; 

const Home = () => {
  const dispatch = useDispatch(); 
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const responseBlog = await dispatch(getAllBlog());
      const productResponse = await dispatch(getAllProduct({ limit: 30 })); 

      setProducts(productResponse?.payload);
      setBlogs(responseBlog?.payload); 
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const specialProducts = products?.filter((item) => item?.tags?.includes("Special")).slice(0, 4);
  const popularProducts = products?.filter((item) => item?.tags?.includes("Popular")).slice(0, 4);
  const featuredProducts = products?.filter((item) => item?.tags?.includes("Featured")).slice(0, 4);
  const mainBannerData = products?.filter((item) => item?.tags?.includes("SUPPERCHARGED")).slice(0, 4);
  const smallBannerData = products?.filter((item) => item?.tags?.includes("Sale")).slice(0, 4);
  const famousProducts = products?.filter((item) => item?.tags?.includes("Famous")).slice(0, 4);
   
  if (loading) {
    return (
      <>  
          <div className="loading-spinner d-flex align-items-center justify-content-center" style={{textAlign: "center", padding: "50px" , height: "100vh"}}>
            <FaSpinner className="spinner" style={{fontSize: "40px", color: "#333", animation: "spin 1s linear infinite"}} />
        </div>
      </>
    );
  }
  return (
    <>
      <Meta title={"Trang chủ"}></Meta>
      <div className="banner-gadient">
        <BannerSection mainBannerData={mainBannerData} smallBannerData={smallBannerData} />
      </div>
      <div className="home-wapper-2 py-4 px-5 garented-service">
        <div className="service d-flex align-items-center justify-content-between">
          {services?.map((i, j) => (
            <div key={i.id || j} className="d-flex align-items-center gap-15">
              <img src={i.image} alt="service" />
              <div>
                <h6>{i.title}</h6>
                <p className="mb-0">{i.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Container class1="fetured-wapper py-5">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Bộ sưu tập được đề xuất</h3>
          </div>
          <ProductCard data={featuredProducts} />
        </div>
      </Container>

      <Container class1="famous-wapper py-5 home-wapper-2">
        <FamousCard prod={famousProducts} />
      </Container>

      <Container class1="special-wapper py-5 ">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Sản phẩm đặc biệt</h3>
          </div>
          <div className="d-grid content-special-product">
          {specialProducts?.map((item) => (
            <SpecialProduct
              key={item?._id}
              id={item?._id}
              title={item?.title}
              brand={item?.brand}
              price={item?.price}
              totalrating={item?.totalrating?.toString()}
              sold={item?.sold}
              quantity={item?.quantity}
              images={item?.images}
              specialDateTime={item?.specialDateTime}
              originalPrice={item?.originalPrice}
            />
          ))}
          </div>
        </div>
      </Container>

      <Container class1="popular-wapper py-5 home-wapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Sản phẩm phổ biến của chúng tôi</h3>
          </div>
          <div className="row">
            <ProductCard data={popularProducts} />
          </div>
        </div>
      </Container>

      <BrandMarquee />

      <Container class1="blog-wapper py-5 home-wapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Blog mới nhất của chúng tôi</h3>
          </div>
          {blogs?.map((item, index) => {
            if (index < 4) {
              return (
                <BlogCard
                  key={index}
                  id={item?._id}
                  title={item?.title}
                  description={item?.description}
                  image={item?.images[0]?.url}
                  date={moment(item?.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                />
              );
            }
            return null;
          })}
        </div>
      </Container>
    </>
  );
};

export default Home;
