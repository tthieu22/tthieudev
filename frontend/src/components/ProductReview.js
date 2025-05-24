import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import StarRatings from "react-star-ratings";
import { toast } from "react-toastify";
import { rating } from "../features/product/productSlice";

const ProductReview = ({ product }) => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");

  const customer = JSON.parse(localStorage.getItem("customer"));
  const token = localStorage.getItem("token");
  const name = customer ? `${customer.firstname} ${customer.lastname}` : "";
  const email = customer?.email || "";
  const { isRating } = useSelector((state) => state.product || {});

  useEffect(() => {
    if (isRating && isRating.ratings) {
      toast.success("Cảm ơn bạn đã đánh giá!");
      setShowForm(false);
      setRatingValue(0);
      setComment("");
    }
  }, [isRating]);

  const toggleForm = () => {
    if (!customer || !token) {
      toast.warning("Bạn cần đăng nhập để đánh giá sản phẩm.");
      return;
    }
    setShowForm(!showForm);
  };

  const handleRatingChange = (newRating) => {
    setRatingValue(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ratingValue || !comment.trim()) {
      toast.error("Vui lòng chọn số sao và nhập nội dung đánh giá.");
      return;
    }
    const data = {
      star: ratingValue,
      comment: comment.trim(),
      prodId: product._id,
    };
    await dispatch(rating(data));
  };

  const renderReviewForm = () => {
    if (!showForm) return null;
    return (
      <div className="review-form py-4">
        <form className="d-flex flex-column gap-20" onSubmit={handleSubmit}>
          <input type="text" className="form-control" value={name} disabled />
          <input type="text" className="form-control" value={email} disabled />
          <StarRatings
            rating={ratingValue}
            starRatedColor="#ffd700"
            numberOfStars={5}
            starDimension="20px"
            starSpacing="3px"
            changeRating={handleRatingChange}
            edit={true}
          />
          <textarea
            className="form-control"
            rows="4"
            placeholder="Nội dung đánh giá"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="button" type="submit">
            Gửi đánh giá
          </button>
        </form>
      </div>
    );
  };

  const renderReviews = () => {
    const ratings = isRating?.ratings || product?.ratings || [];
    return ratings.length > 0 ? (
      ratings.map((item, index) => {
        const isCurrentUser = item.postedby === customer?._id;
        return (
          <div className="review mb-3" key={index}>
            <div className="d-flex gap-10 flex-column">
              <h6 className="mb-0">
                {isCurrentUser ? name : `Người dùng: ${item.postedby}`}
              </h6>
              <StarRatings
                rating={item?.star || 0}
                numberOfStars={5}
                starRatedColor="#ffd700"
                starDimension="20px"
                starSpacing="2px"
              />
            </div>
            <p className="mt-3">{item?.comment}</p>
          </div>
        );
      })
    ) : (
      <p className="text-muted">Chưa có đánh giá nào.</p>
    );
  };

  return (
    <div className="row">
      <div className="col-12">
        <h4 id="review">Đánh giá</h4>
        <div className="review-inner-wapper">
          <div className="review-head d-flex justify-content-between align-items-end">
            <div>
              <h4 className="mb-2">Đánh giá của khách hàng</h4>
              <div className="d-flex gap-10 align-items-center">
                <StarRatings
                  rating={
                    parseFloat(isRating?.totalrating || product?.totalrating) ||
                    0
                  }
                  starRatedColor="#ffd700"
                  numberOfStars={5}
                  starDimension="15px"
                  starSpacing="2px"
                />
                <p className="mb-0">
                  Dựa trên{" "}
                  {(isRating?.ratings || product?.ratings || []).length} đánh
                  giá
                </p>
              </div>
            </div>
            <div>
              <a
                href="#d"
                className="text-dark text-decoration-underline"
                onClick={toggleForm}
              >
                Viết 1 đánh giá
              </a>
            </div>
          </div>
          {renderReviewForm()}
          <div className="reviews mt-3">{renderReviews()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
