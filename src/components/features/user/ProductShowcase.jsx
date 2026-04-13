import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlay, FiPackage } from "react-icons/fi";
import productApi from "../../../api/productApi";

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giữ lại dữ liệu dự phòng để không bị trống ảnh
  const mockProducts = [
    { id: "m1", title: "Vocal Recording", description: "Dự án thu âm chuyên nghiệp.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: "m2", title: "Music Video", description: "Sản xuất MV ca nhạc 4K.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: "m3", title: "Audio Master", description: "Xử lý âm thanh hậu kỳ.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: "m4", title: "Studio Light", description: "Ánh sáng điện ảnh cho dự án.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll({ page: 0, size: 20 });
      const data = response.data?.data || response.data || response;
      const list = data.list || data.content || (Array.isArray(data) ? data : []);
      setProducts(list.length > 0 ? list : mockProducts);
    } catch (err) {
      console.error(err);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const getThumbnail = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";
    const v = url.match(/[?&]v=([^&]+)/);
    if (v) return `https://img.youtube.com/vi/${v[1]}/maxresdefault.jpg`;
    if (url.includes("youtu.be/")) return `https://img.youtube.com/vi/${url.split("youtu.be/")[1]}/maxresdefault.jpg`;
    return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="relative z-10 pt-16 pb-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[420px] bg-white/20 rounded-[32px] border border-white/50 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" }}
                  whileHover={{ y: -15 }}
                  className="group relative h-[420px] bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-[#35104C]/5 border border-white transition-all duration-500"
                >
                  <div className="absolute inset-0">
                    <img
                      src={getThumbnail(product.videoUrl)}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#35104C] via-[#35104C]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 pb-20">
                    <button
                      onClick={() => window.open(product.videoUrl, "_blank")}
                      className="w-20 h-20 bg-white text-[#35104C] rounded-[28px] flex items-center justify-center shadow-2xl"
                    >
                      <FiPlay size={28} className="fill-current ml-1" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3 group-hover:text-[#6CD1FD] transition-colors">{product.title}</h3>
                    <p className="text-[14px] text-white/60 line-clamp-2 leading-relaxed font-medium">
                      {product.description || "A remarkable creative execution showcasing innovative visual storytelling."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
