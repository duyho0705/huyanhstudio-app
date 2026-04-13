import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiZap, FiCamera, FiMusic, FiPlayCircle, FiStar } from "react-icons/fi";

const Services = () => {
  const mockServices = [
    {
      id: 1,
      name: "Vocal Recording",
      price: 500000,
      description: "Phòng thu âm chuyên nghiệp với trang bị hiện đại nhất.",
      benefits: ["1 giờ thu âm", "Kỹ thuật viên hỗ trợ", "Chỉnh sửa cao độ cơ bản", "Xuất file Raw chất lượng"],
      isPremium: false,
      icon: <FiMusic />
    },
    {
      id: 2,
      name: "Full Production",
      price: 5000000,
      description: "Gói sản xuất trọn gói đơn ca/cover chuyên nghiệp.",
      benefits: ["Hòa âm phối khí mới", "Thu âm không giới hạn", "Mix & Master cao cấp", "Hỗ trợ phát hành"],
      isPremium: true,
      icon: <FiStar />
    },
    {
      id: 3,
      name: "MV Studio",
      price: 2500000,
      description: "Quay video phòng thu chất lượng 4K cực chất.",
      benefits: ["Quay 3 góc máy", "Ánh sáng Cinematic", "Edit video chuyên nghiệp", "Color grading"],
      isPremium: false,
      icon: <FiCamera />
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container-app pb-32">
      <header className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-[#35104C]/10 text-[#35104C] text-[16px] font-semibold mb-6"
        >
          Bảng giá Huy Anh Studio
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {mockServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ y: -10 }}
            className={`relative p-10 rounded-[48px] bg-white transition-all duration-300 flex flex-col ${service.isPremium
              ? 'ring-4 ring-[#6CD1FD] shadow-2xl shadow-[#6CD1FD]/20 scale-105 z-10'
              : 'border border-gray-100 shadow-xl shadow-gray-200/50'
              }`}
          >
            {service.isPremium && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#6CD1FD] text-[#35104C] px-6 py-2 rounded-full text-[15px] font-bold shadow-lg">
                Gợi ý
              </div>
            )}

            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl mb-8 ${service.isPremium ? 'bg-[#35104C] text-white shadow-xl' : 'bg-[#6CD1FD]/10 text-[#6CD1FD]'
              }`}>
              {service.icon}
            </div>

            <h3 className="text-2xl font-bold text-[#35104C] mb-3">{service.name}</h3>
            <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
              {service.description}
            </p>

            <div className="mb-10">
              <span className="text-4xl font-black text-[#35104C]">{formatPrice(service.price)}</span>
              <span className="text-gray-400 font-bold ml-2">/ gói</span>
            </div>

            <div className="space-y-4 mb-12 flex-1">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${service.isPremium ? 'bg-[#6CD1FD] text-[#35104C]' : 'bg-green-50 text-green-500'
                    }`}>
                    <FiCheck size={14} strokeWidth={4} />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-5 rounded-[24px] font-black text-lg transition-all active:scale-95 shadow-lg ${service.isPremium
              ? 'bg-[#35104C] text-white hover:bg-[#4a1c6a]'
              : 'bg-gray-50 text-[#35104C] hover:bg-gray-100 border border-gray-200'
              }`}>
              {service.isPremium ? 'Bắt đầu ngay' : 'Đăng ký'}
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default Services;
