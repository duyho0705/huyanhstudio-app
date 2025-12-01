import { useState, useEffect, useRef } from "react";
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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const sliderRef = useRef(null);
  const isFetching = useRef(false);

  // Drag variables
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Fetch API + append
  const fetchProducts = async (p) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const res = await productApi.getAll({
        page: p,
        size: 6,
      });

      setProducts((prev) => [...prev, ...res.data.list]);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }

    isFetching.current = false;
  };

  // Load first page
  useEffect(() => {
    fetchProducts(0);
  }, []);

  // Infinite scroll
  const checkLoadMore = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const nearEnd =
      slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 200;

    if (nearEnd && page + 1 < totalPages) {
      setPage((prev) => {
        const next = prev + 1;
        fetchProducts(next);
        return next;
      });
    }
  };

  // DRAG with mouse
  const handleMouseDown = (e) => {
    const slider = sliderRef.current;
    isDown.current = true;
    slider.classList.add("active");

    startX.current = e.pageX - slider.offsetLeft;
    scrollLeft.current = slider.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    sliderRef.current.classList.remove("active");
  };

  const handleMouseUp = () => {
    isDown.current = false;
    sliderRef.current.classList.remove("active");
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();

    const slider = sliderRef.current;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX.current) * 1.2;

    slider.scrollLeft = scrollLeft.current - walk;
    checkLoadMore();
  };

  // TOUCH
  const handleTouchMove = () => {
    checkLoadMore();
  };

  return (
    <div className="product-cover">
      <div className="container" id="products">
        <section className="product">
          <h3 className="product__title">Sản phẩm đã thực hiện</h3>
          <div
            className="product-slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {products.map(({ id, title, videoUrl }) => {
              const embedUrl = convertToEmbedUrl(videoUrl);

              return (
                <div className="video-slide-item" key={id}>
                  <div className="video-card">
                    <div className="video-wrapper">
                      <iframe
                        src={embedUrl}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
