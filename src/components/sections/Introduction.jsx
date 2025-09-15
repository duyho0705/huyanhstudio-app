import "../../styles/Introduction.scss";
import mainImg from "../../assets/introduction-main.jpg";
import topImg from "../../assets/introduction-top.jpg";
import bottomImg from "../../assets/introduction-bottom.jpg";
import { CiStar } from "react-icons/ci";
import { FaCheck, FaPlay } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

import { useEffect, useState } from "react";

const Introduction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  return (
    <section className="intro" id="introduction">
      <div className="container intro__wrapper">
        {/* Left - text */}
        <div className="intro__content">
          <div className="intro__tagline">
            <CiStar className="intro__tagline-icon" />
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
              <FaCalendarAlt className="intro__button-icon"/>
              Đặt lịch ngay
            </a>
            <button
              className="intro__button intro__button--secondary"
              onClick={openModal}
            >
              <FaPlay className="intro__button-icon" />
              Xem demo
            </button>
          </div>

          <div className="intro__features">
            <div className="intro__feature">
              <FaCheck className="intro__feature-icon" /> Cách âm chuẩn studio
            </div>
            <div className="intro__feature">
              <FaCheck className="intro__feature-icon" /> Kỹ sư tận tâm
            </div>
            <div className="intro__feature">
              <FaCheck className="intro__feature-icon" /> Thiết bị cao cấp
            </div>
            <div className="intro__feature">
              <FaCheck className="intro__feature-icon" /> Giao file nhanh chóng
            </div>
          </div>
        </div>

        {/* Right - images */}
        <div className="intro__images">
          <img
            src={mainImg}
            alt="Phòng thu chính"
            className="intro__image-main"
          />
          <img src={topImg} alt="Decor trên" className="intro__image-top" />
          <img
            src={bottomImg}
            alt="Decor dưới"
            className="intro__image-bottom"
          />
        </div>
      </div>

      {/* Modal video */}
      {isModalOpen && (
        <div className="video-modal" onClick={closeModal}>
          <div
            className="video-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="1000px"
              height="700px"
              src="https://www.youtube.com/embed/jOJr79Yz1mQ?autoplay=1&vq=highres"
              title="Demo"
              frameBorder="0"
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
