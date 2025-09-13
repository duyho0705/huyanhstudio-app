import "../../styles/Introduction.scss";
import mainImg from "../../assets/introduction-main.jpg";
import topImg from "../../assets/introduction-top.jpg";
import bottomImg from "../../assets/introduction-bottom.jpg";
import { CiStar } from "react-icons/ci";
import { FaCheck, FaPlay } from "react-icons/fa";

const Introduction = () => {
  return (
    <section className="intro" id="introduction">
      <div className="container intro__wrapper">
        {/* Left - text */}
        <div className="intro__content">
          <div className="intro__tagline">
            <CiStar className="intro__tagline-icon" />
            Âm thanh sáng, mix/master trong trẻo
          </div>

          <h1 class="intro__title">
            Phòng thu
            <span class="gradient"> sáng, </span>
            <span class="gradient"> xịn </span>
            cho mọi dự án âm nhạc
          </h1>

          <p className="intro__description">
            Từ thu vocal, guitar, podcast đến mix & master. Không gian hiện đại,
            ánh sáng tươi, cảm hứng bùng nổ.
          </p>

          <div className="intro__actions">
            <a href="#booking" className="intro__button intro__button--primary">
              Đặt lịch ngay
            </a>
            <button className="intro__button intro__button--secondary">
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
    </section>
  );
};

export default Introduction;
