import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const defaultImages = [
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Ảnh 1: Rừng xanh tươi mát",
  },
  {
    url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&q=80",
    description: "Ảnh 2: Đường mòn núi đồi",
  },
  {
    url: "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=400&q=80",
    description: "Ảnh 3: Hồ nước trong xanh",
  },
  {
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
    description: "Ảnh 4: Cảnh hoàng hôn rực rỡ",
  },
];

const YearEffect = ({ products }) => {
  const currentYear = new Date().getFullYear().toString();

  const images =
    Array.isArray(products) && products.length > 0
      ? products.map((item) => ({
          url: item.images[0].url,
          id: item._id,
          description: item.title || "",
        }))
      : defaultImages;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % currentYear.length));
    }, 2000);

    return () => clearInterval(interval);
  }, [autoPlay, currentYear.length]);

  const handleClickDigit = (idx) => {
    setAutoPlay(false);
    setSelectedIndex((prev) => (prev === idx ? null : idx));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAutoPlay(true);
      if (selectedIndex === null) {
        setSelectedIndex(0);
      }
    }, 5000);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const currentImage =
    selectedIndex !== null
      ? images[selectedIndex % images.length]
      : images[0];

  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        textAlign: "center",
        padding: "40px",
        borderRadius: "20px",
        backgroundImage: `url(${currentImage.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        userSelect: "none",
      }}
      className="year-container"
    >
      <div
        style={{
          display: "flex",
          fontSize: "20rem",
          fontWeight: "bold",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {currentYear.split("").map((digit, idx) => {
          const img = images[idx % images.length];

          return (
            <div
              key={idx}
              className="digit"
              onClick={() => handleClickDigit(idx)}
              style={{
                backgroundImage: `url(${img.url})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                // visibility: isVisible ? "visible" : "hidden",
                backgroundSize: "cover",
                backgroundPosition: "center",
                margin: "0 10px",
              }}
            >
              {digit}
            </div>
          );
        })}
      </div>

      <Link to={currentImage.id ? `/product/${currentImage.id}` : "#"} className="text-dark">
        <div
          style={{
            marginTop: "20px",
            fontSize: "1rem",
            backgroundColor: "rgba(212, 212, 212, 0.4)",
            padding: "10px 20px",
            borderRadius: "10px",
            display: "inline-block",
            maxWidth: "600px",
            cursor: "pointer",
            color: "black",
          }}
          dangerouslySetInnerHTML={{
            __html:
              selectedIndex !== null
                ? currentImage.description
                : "Click vào một số để xem mô tả",
          }}
        />
      </Link>
    </div>
  );
};

export default YearEffect;
