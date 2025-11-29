import { useState, useEffect } from "react";
import "../../styles/ProductMade.scss";
import productApi from "../../api/productApi";

function convertToEmbedUrl(url) {
  const match = url.match(/v=([^&]+)/);
  const videoId = match ? match[1] : null;
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

const ProductMade = () => {
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll();
        setProducts(response.data.list); // tùy backend bạn
      } catch (err) {
        console.error("Fetch products error: ", err);
      }
    };
    fetchProducts();
  }, []);

  const visibleProducts = showAll ? products : products.slice(0, 3);

  return (
    <div className="product-cover">
      <div className="container" id="products">
        <section className="product">
          <div className="row">
            <div className="col-xl-12">
              <div className="product__header">
                <h3 className="product__title">Sản phẩm đã thực hiện</h3>
                <button
                  className="product__btn"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Ẩn bớt" : "Xem tất cả"}
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            {visibleProducts.map(({ id, title, videoUrl }) => {
              const embedUrl = convertToEmbedUrl(videoUrl);

              return (
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6" key={id}>
                  <div className="video-card">
                    <div className="video-wrapper">
                      <iframe
                        src={embedUrl}
                        title={`Video ${title}`}
                        tabIndex={-1}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="video-title">{title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductMade;
