import mainImg from "../../assets/introduction-main.jpg";
import topImg from "../../assets/introduction-top.jpg";
import bottomImg from "../../assets/introduction-bottom.jpg";
import { FaCheck, FaPlay, FaCalendarAlt } from "react-icons/fa";
import { PiStarAndCrescentThin } from "react-icons/pi";
import { useEffect, useState } from "react";

const Introduction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  return (
    <section className="py-16" id="introduction">
      <div className="container-app flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left - Content */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 px-4 py-2 rounded-full border-2 border-gray-100 shadow-md mb-6">
            <PiStarAndCrescentThin className="text-xl text-amber-500" />
            Âm thanh sáng, mix/master trong trẻo
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-black mb-5 leading-tight">
            Thu âm chuyên nghiệp — âm thanh bắt dính cảm xúc
          </h1>

          <p className="text-base text-gray-500 mb-6 max-w-[90%] leading-relaxed">
            Từ thu vocal, guitar, podcast đến mix & master. Không gian hiện đại,
            ánh sáng tươi, cảm hứng bùng nổ.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 px-7 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 rounded-md hover:opacity-90 transition-all no-underline"
            >
              <FaCalendarAlt className="text-sm" />
              Đặt lịch ngay
            </a>
            <button
              className="inline-flex items-center gap-2 px-7 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-md hover:border-blue-500 hover:text-blue-500 transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlay className="text-sm" />
              Xem demo
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-500">
            {[
              "Cách âm chuẩn studio",
              "Kỹ sư tận tâm",
              "Thiết bị cao cấp",
              "Giao file nhanh chóng",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <FaCheck className="text-xs text-green-500" /> {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Images */}
        <div className="flex-1 relative flex justify-center items-center">
          <img
            src={mainImg}
            alt="Phòng thu chính"
            className="relative z-10 w-full h-[387px] object-cover border-[12px] border-white rounded-[29px] shadow-xl lg:absolute lg:right-0"
          />
          <img
            src={topImg}
            alt="Decor trên"
            className="hidden lg:block absolute -top-60 -right-12 w-[186px] h-[154px] object-cover rounded-xl shadow-lg border-4 border-white z-20 rotate-6"
          />
          <img
            src={bottomImg}
            alt="Decor dưới"
            className="hidden lg:block absolute -bottom-52 -left-12 w-[30%] h-[152px] object-cover rounded-xl shadow-lg border-4 border-white z-20 -rotate-6"
          />
        </div>
      </div>

      {/* Modal Video */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[1000px] aspect-video mx-4 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://www.youtube.com/embed/jOJr79Yz1mQ?autoplay=1&vq=highres"
              title="Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none rounded-2xl"
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default Introduction;
