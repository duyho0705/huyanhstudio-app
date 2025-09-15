import { useState } from "react";
import "../../styles/ProductMade.scss";

const products = [
  { id: 1, title: "Video Dự án A", video: "https://www.youtube.com/embed/KfjeMr3nJ4o" },
  { id: 2, title: "Video Dự án B", video: "https://www.youtube.com/embed/tgbNymZ7vqY" },
  { id: 3, title: "Video Dự án C", video: "https://www.youtube.com/embed/KfjeMr3nJ4o" },
  { id: 4, title: "Video Dự án A", video: "https://www.youtube.com/embed/KfjeMr3nJ4o" },
  { id: 5, title: "Video Dự án B", video: "https://www.youtube.com/embed/KfjeMr3nJ4o" },
  { id: 6, title: "Video Dự án C", video: "https://www.youtube.com/embed/KfjeMr3nJ4o" },
];

const ProductMade = () => {
  const [showAll, setShowAll] = useState(false);

  // if show all = false, get 3 default videos
  const visibleProducts = showAll ? products : products.slice(0, 3);
  return (
    <div className="container" id="products">
      <section className="product">
        <div className="row">
          <div className="col-xl-12">
            <div className="product__header">
              <h3 className="product__title">Sản phẩm đã thực hiện</h3>
              <button className="product__btn" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Ẩn bớt" : "Xem tất cả"}
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          {visibleProducts.map(({ id, title, video }) => (
            <div className="col-xl-4" key={id}>
              <div className="video-card">
                <div className="video-wrapper">
                  <iframe
                    src={video}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="video-title">{title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductMade;
