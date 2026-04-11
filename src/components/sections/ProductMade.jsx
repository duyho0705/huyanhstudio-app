import { useState, useEffect, useRef } from "react";
import productApi from "../../api/productApi";

function getYouTubeId(url) {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : null;
}

const ProductMade = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const sliderRef = useRef(null);
  const isFetching = useRef(false);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const fetchProducts = async (p) => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const res = await productApi.getAll({ page: p, size: 6 });
      const newProducts = res.data.list.map((item) => ({ ...item, isPlaying: false }));
      setProducts((prev) => [...prev, ...newProducts]);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
    isFetching.current = false;
  };

  useEffect(() => { fetchProducts(0); }, []);

  const checkLoadMore = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const nearEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 200;
    if (nearEnd && page + 1 < totalPages) {
      setPage((prev) => { const next = prev + 1; fetchProducts(next); return next; });
    }
  };

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    sliderRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
    checkLoadMore();
  };

  const handlePlay = (index) => {
    setProducts((prev) => prev.map((item, i) => (i === index ? { ...item, isPlaying: true } : item)));
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-app" id="products">
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm đã thực hiện</h3>
          <div
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={checkLoadMore}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map(({ id, title, videoUrl, isPlaying }, index) => {
              const videoId = getYouTubeId(videoUrl);
              const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
              return (
                <div key={id} className="flex-shrink-0 w-72">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div
                      className="relative aspect-video cursor-pointer"
                      onClick={() => !isPlaying && handlePlay(index)}
                    >
                      {!isPlaying && (
                        <div className="relative w-full h-full">
                          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 shadow-lg">
                              <span className="text-blue-600 text-lg ml-0.5">▶</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {isPlaying && (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                          title={title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-none"
                        />
                      )}
                    </div>
                    <div className="px-4 py-3 text-sm font-medium text-gray-800 truncate">{title}</div>
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
