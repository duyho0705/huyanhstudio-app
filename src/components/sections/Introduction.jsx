import "../../styles/Introduction.scss";
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
    <section className="intro" id="introduction">
      <div className="container intro__wrapper">
        {/* Left - Content */}
        <div className="intro__content">
          <div className="intro__tagline">
            <PiStarAndCrescentThin className="intro__tagline-icon" />
            Âm thanh sáng, mix/master trong trẻo
          </div>

          <h1 className="intro__title">
            Thu âm chuyên nghiệp — âm thanh bắt dính cảm xúc
          </h1>

          <p className="intro__description">
            Từ thu vocal, guitar, podcast đến mix & master. Không gian hiện đại,
            ánh sáng tươi, cảm hứng bùng nổ.
          </p>

          <div className="intro__actions">
            <a href="#booking" className="intro__button intro__button--primary">
              <FaCalendarAlt className="intro__button-icon" />
              Đặt lịch ngay
            </a>
            <button
              className="intro__button intro__button--secondary"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlay className="intro__button-icon" />
              Xem demo
            </button>
          </div>

          <div className="intro__features">
            {[
              "Cách âm chuẩn studio",
              "Kỹ sư tận tâm",
              "Thiết bị cao cấp",
              "Giao file nhanh chóng",
            ].map((feature, i) => (
              <div key={i} className="intro__feature">
                <FaCheck className="intro__feature-icon" /> {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Images */}
        <div className="intro__images">
          <img
            src={mainImg}
            alt="Phòng thu chính"
            className="intro__image-main"
          />
          <img src={topImg} alt="Decor trên" className="intro__image-top" />
          <img src={bottomImg} alt="Decor dưới" className="intro__image-bottom" />
        </div>
      </div>

      {/* Modal Video */}
      {isModalOpen && (
        <div className="video-modal" onClick={() => setIsModalOpen(false)}>
          <div
            className="video-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://www.youtube.com/embed/jOJr79Yz1mQ?autoplay=1&vq=highres"
              title="Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default Introduction;
