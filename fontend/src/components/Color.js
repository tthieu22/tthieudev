import React, { useState, useEffect } from "react";
import { BsCheck } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { getColors } from "../features/product/productSlice";

const Color = ({ prop = [], onSelect, selectedColor }) => {
  const dispatch = useDispatch();

  // Lấy danh sách màu từ Redux
  const colorstate = useSelector((state) => state.product?.colors);

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  // Lưu id màu đang chọn
  const [internalSelectedColor, setInternalSelectedColor] = useState(selectedColor || null);

  // Cập nhật khi prop selectedColor thay đổi
  useEffect(() => {
    setInternalSelectedColor(selectedColor);
  }, [selectedColor]);

  // Lấy title của màu đang chọn
  const selectedColorTitle = colorstate?.find(c => c?._id === internalSelectedColor)?.title || "";

  const handleColorClick = (rgbValue) => {
    const foundColor = colorstate?.find(c => c.title === rgbValue);
    if (!foundColor) return;
    setInternalSelectedColor(foundColor._id);
    if (onSelect) onSelect(foundColor._id);
  };

  return (
    <>
      <ul className="colors gap-10 m-0 d-flex" style={{ listStyle: "none", padding: 0 }}>
        {prop.length > 0 ? (
          prop.map((rgbValue, index) => {
            const colorObj = colorstate?.find(c => c?.title === rgbValue);
            if (!colorObj) return null;

            return (
              <li
                key={index}
                style={{
                  backgroundColor: rgbValue,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  position: "relative",
                  cursor: "pointer",
                  border:
                    internalSelectedColor === colorObj._id ? "2px solid #000" : "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => handleColorClick(rgbValue)}
                title={colorObj.title}
              >
                {internalSelectedColor === colorObj._id && (
                  <BsCheck style={{ color: "#fff", fontSize: 18 }} />
                )}
              </li>
            );
          })
        ) : (
          <p>No colors available</p>
        )}
      </ul>

      {/* Hiển thị tên màu nếu cần */}
      {selectedColorTitle && (
        <p style={{ marginTop: 8 }}>Selected color: {selectedColorTitle}</p>
      )}
    </>
  );
};

export default Color;
