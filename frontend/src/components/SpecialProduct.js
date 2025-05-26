import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const SpecialProduct = (props) => {
  const { id, title, brand, price, totalrating, sold, quantity, images, specialDateTime, originalPrice } = props;
  const percent = Math.round((sold / (sold + quantity)) * 100);

  const [timeLeft, setTimeLeft] = useState({
    days: null,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!specialDateTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(specialDateTime);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const pad = (n) => String(n).padStart(2, "0");

      setTimeLeft({
        days,
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [specialDateTime]);

  return ( 
    
    <div className="special-product-card">
    <div className="d-flex justify-content-between content-special-product">
      <Link to={`/product/${id}`} className="d-flex flex-column special-img align-items-center ">
        <div className="box-img">
          {images?.[0]?.url && (
            <img src={images[0].url} alt="product" className="img-fluid" />
          )}
        </div>
        <div className="slide">
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            pagination={true}
            modules={[Navigation, Pagination]}
            className="mySwiper"
          >
            {images?.map((img, index) => (
              <SwiperSlide key={img._id || img.url || index}>
                <img src={img.url} alt={`slide-${index}`} className="img-slide-product" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Link>

      <div className="special-product-content">
        <h5 className="brand">{brand}</h5>
        <Link to={`/product/${id}`} className="title">{title}</Link>

        <StarRatings
          rating={Number(totalrating) || 4}
          starRatedColor="#ffd700"
          numberOfStars={5}
          starDimension="18px"
          starSpacing="2px"
        />

        <p className="price">
          <span className="red-p">{Number(price).toLocaleString("vi-VN") + " ₫"}</span>&nbsp;
          {originalPrice && (
            <strike>{Number(originalPrice).toLocaleString("vi-VN") + " ₫"}</strike>
          )}
        </p>

        <div className="discount-still d-flex align-items-center gap-10">
          {timeLeft.days !== null && (
            <p className="mb-0">
              <b>{timeLeft.days}</b>&nbsp;{timeLeft.days === 1 ? "Day" : "Days"}
            </p>
          )}
          <div className="d-flex gap-10 align-items-center">
            <span className="badge rounded-circle">{timeLeft.hours}</span>
            <span className="badge rounded-circle">{timeLeft.minutes}</span>
            <span className="badge rounded-circle">{timeLeft.seconds}</span>
          </div>
        </div>

        <div className="prod-count mt-4">
          <p>Product: {quantity}</p>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${percent}%` }}
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {quantity > 0 ? (
          <Link to={`/product/${id}`} className="button text-center mt-3">View product</Link>
        ) : (
          <button className="button-disabled mt-3" disabled title="Out of stock">
            Out of stock
          </button>
        )}
      </div>
    </div>
  </div>
  );
};

export default SpecialProduct;
