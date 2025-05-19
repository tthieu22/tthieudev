import React from "react";
import Marquee from "react-fast-marquee";

const brandImages = [
  "images/brand-01.png",
  "images/brand-02.png",
  "images/brand-03.png",
  "images/brand-04.png",
  "images/brand-05.png",
  "images/brand-06.png",
  "images/brand-07.png",
  "images/brand-08.png",
];

const BrandMarquee = () => {
  return (
    <div className="maquee-wapper w-100 overflow-hidden">
      <div className="row">
        <div className="col-12">
          <div className="maquee-inner-wapper bg-white card-wapper">
            <Marquee className="d-flex" speed={40} gradient={false}>
              {[...brandImages, ...brandImages].map((src, index) => (
                <div className="w-50" key={index}>
                  <img
                    src={src}
                    className="w-100 img-fluid"
                    alt={`brand-${index + 1}`}
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandMarquee;
