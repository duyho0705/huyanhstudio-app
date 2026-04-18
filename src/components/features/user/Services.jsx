import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiZap, FiCamera, FiMusic, FiPlayCircle, FiStar, FiMic, FiVideo, FiHeart, FiBriefcase } from "react-icons/fi";
import serviceApi from "../../../api/serviceApi";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceApi.getAll();
        const data = response.data || response;
        let list = [];

        // Handle various response structures
        if (data?.data?.list && Array.isArray(data.data.list)) {
          list = data.data.list;
        } else if (data?.data?.content && Array.isArray(data.data.content)) {
          list = data.data.content;
        } else if (data?.list && Array.isArray(data.list)) {
          list = data.list;
        } else if (data?.content && Array.isArray(data.content)) {
          list = data.content;
        } else if (Array.isArray(data)) {
          list = data;
        }
        
        // Filter active services
        setServices(list.filter(s => s.active !== false));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const iconMap = {
    Mic: <FiMic />,
    Music: <FiMusic />,
    Star: <FiStar />,
    Camera: <FiCamera />,
    Video: <FiVideo />,
    Zap: <FiZap />,
    Heart: <FiHeart />,
  };

  const getIcon = (iconName) => iconMap[iconName] || <FiBriefcase />;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading && services.length === 0) {
    return (
      <div className="container-app py-16 sm:py-32 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-64 bg-gray-200 rounded-full mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-gray-50 rounded-[24px]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app pb-16 sm:pb-32 sm:pt-0">
      <header className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-[#35104C]/10 text-[#35104C] text-[16px] font-semibold mb-6"
        >
          Bảng giá Huy Anh Studio
        </motion.div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
        {services.length > 0 ? (
          services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -10 }}
              className={`relative p-6 sm:p-8 lg:p-10 rounded-[20px] sm:rounded-[24px] bg-white transition-all duration-300 flex flex-col ${service.featured
                ? 'ring-2 sm:ring-4 ring-[#6CD1FD] shadow-2xl shadow-[#6CD1FD]/20 sm:scale-105 z-10'
                : 'border border-gray-100 shadow-xl shadow-gray-200/50'
                }`}
            >
              {service.featured && (
                <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 bg-[#6CD1FD] text-[#35104C] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-[15px] font-bold shadow-lg">
                  Gợi ý
                </div>
              )}

              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[24px] flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-8 ${service.featured ? 'bg-[#35104C] text-white shadow-xl' : 'bg-[#6CD1FD]/10 text-[#6CD1FD]'
                }`}>
                {getIcon(service.icon)}
              </div>

              <h3 className="text-lg sm:text-2xl font-bold text-[#35104C] mb-2 sm:mb-3">{service.name}</h3>
              <p className="text-gray-400 text-xs sm:text-sm font-medium mb-4 sm:mb-8 leading-relaxed">
                {service.description}
              </p>

              <div className="mb-6 sm:mb-10">
                <span className="text-2xl sm:text-4xl font-black text-[#35104C]">{formatPrice(service.price)}</span>
                <span className="text-gray-400 font-bold ml-1 sm:ml-2 text-sm">/ {service.unit || 'gói'}</span>
              </div>

              <div className="space-y-2.5 sm:space-y-4 mb-6 sm:mb-12 flex-1">
                {(service.benefitsList && service.benefitsList.length > 0) ? (
                  service.benefitsList.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2.5 sm:gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${service.featured ? 'bg-[#6CD1FD] text-[#35104C]' : 'bg-green-50 text-green-500'
                        }`}>
                        <FiCheck size={14} strokeWidth={4} />
                      </div>
                      <span className="text-[13px] sm:text-[15px] font-semibold text-gray-600">{benefit}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">Vui lòng liên hệ để biết thêm chi tiết</p>
                )}
              </div>

              <button className={`w-full py-3.5 sm:py-5 rounded-[16px] sm:rounded-[24px] font-black text-base sm:text-lg transition-all active:scale-95 shadow-lg ${service.featured
                ? 'bg-[#35104C] text-white hover:bg-[#4a1c6a]'
                : 'bg-gray-50 text-[#35104C] hover:bg-gray-100 border border-gray-200'
                }`}>
                {service.buttonText || (service.featured ? 'Bắt đầu ngay' : 'Đăng ký')}
              </button>
            </motion.div>
          ))
        ) : !loading && (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 font-medium">Hiện tại chưa có dịch vụ nào khả dụng.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Services;
