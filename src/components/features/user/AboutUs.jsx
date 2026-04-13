import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const AboutUs = () => {
  return (
    <div className="container-app pb-32 pt-8">
      <header className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-[#35104C]/10 text-[#35104C] text-[16px] font-semibold mb-6"
        >
          Câu chuyện của chúng tôi
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-50 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-[#35104C] mb-8">Tầm nhìn & Sứ mệnh</h2>
            <div className="space-y-6">
              {[
                "Cung cấp không gian sáng tạo chuyên nghiệp nhất.",
                "Trang thiết bị hiện đại, đạt tiêu chuẩn quốc tế.",
                "Đội ngũ kỹ thuật viên tận tâm, giàu kinh nghiệm.",
                "Hỗ trợ nghệ sĩ trẻ phát triển tài năng âm nhạc."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <FiCheckCircle className="mt-1 text-[#6CD1FD] shrink-0 text-2xl" />
                  <p className="font-semibold text-gray-700 text-lg leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-[#35104C] p-8 rounded-[32px] text-white">
                <div className="text-3xl font-black mb-1">500+</div>
                <div className="text-sm font-medium opacity-70 italic">Dự án hoàn thành</div>
              </div>
              <div className="bg-[#6CD1FD] p-8 rounded-[32px] text-[#35104C]">
                <div className="text-3xl font-black mb-1">100%</div>
                <div className="text-sm font-medium opacity-70 italic">Hài lòng</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[48px] overflow-hidden shadow-2xl border-8 border-white bg-white min-h-[500px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6382883247047!2d109.32377821142586!3d13.058680712908375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316fee7d9226271d%3A0xd2e28957dd5b2f71!2sPh%C3%B2ng%20Thu%20%C3%A2m%20Huy%20Anh%20Studio!5e0!3m2!1svi!2s!4v1776065975373!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '550px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Huy Anh Studio"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
