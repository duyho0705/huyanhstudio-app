import "../../styles/Introduction.scss";
import mainImg from "../../assets/introduction-main.jpg";
import topImg from "../../assets/introduction-top.jpg";
import bottomImg from "../../assets/introduction-bottom.jpg";
import { CiStar } from "react-icons/ci";
import { FaCheck, FaPlay } from "react-icons/fa";

const Introduction = () => {
  return (
    <div className="container">
      <div className="intro row">
        {/* Left side - text */}
        <div className="col-xl-6">
          <div className="intro__text">
            <div className="intro__tagline">
              <CiStar className="intro__tagline-icon" />
              Âm thanh sáng, mix/master trong trẻo
            </div>

            <h1 className="intro__title">
              Phòng thu
              <span className="intro__title--highlight"> sáng, xịn </span>
              cho mọi dự án âm nhạc
            </h1>

            <p className="intro__description">
              Từ thu vocal, guitar, podcast đến mix & master. Không gian hiện
              đại, ánh sáng tươi, cảm hứng bùng nổ.
            </p>

            <div className="intro__actions">
              <button className="intro__button intro__button--primary">
                Đặt lịch ngay
              </button>
              <button className="intro__button intro__button--secondary">
                <FaPlay className="intro__button-icon" />
                Xem demo
              </button>
            </div>

            <div className="intro__features">
              <div className="intro__feature">
                <FaCheck className="intro__feature-icon" />
                Phòng thu đạt chuẩn cách âm
              </div>
              <div className="intro__feature">
                <FaCheck className="intro__feature-icon" />
                Kỹ sư âm thanh tận tâm
              </div>
              <div className="intro__feature">
                <FaCheck className="intro__feature-icon" />
                Thiết bị thu âm cao cấp
              </div>
              <div className="intro__feature">
                <FaCheck className="intro__feature-icon" />
                Bàn giao nhanh, đúng hẹn
              </div>
            </div>
          </div>
        </div>

        {/* Right side - images */}
        <div className="col-xl-6">
          <div className="intro__image">
            <img src={mainImg} alt="Phòng thu chính" className="intro__image-main" />
            <img src={topImg} alt="Decor trên" className="intro__image-top" />
            <img src={bottomImg} alt="Decor dưới" className="intro__image-bottom" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
