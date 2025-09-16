import "../../styles/Footer.scss";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { CiPhone } from "react-icons/ci";
import { MdOutgoingMail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import logoImg from "../../assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__row row">
          {/* Studio Info */}
          <div className="col-xl-3 col-md-6">
            <div className="footer__block">
              <span
                className="footer__title footer__title--brand"
                onClick={() => (window.location.href = "/")}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={logoImg}
                  alt="Logo"
                  style={{
                    height: "40px",
                    width: "auto",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginRight: "8px",
                  }}
                />
                HA Studio
              </span>
              <p className="footer__text">
                Phòng thu âm sáng, hiện đại tại TP.HCM. Đặt lịch linh hoạt –
                dịch vụ tận tâm.
              </p>
              <p className="footer__text">
                <CiPhone className="footer__icon" /> 0393248014
              </p>
              <p className="footer__text">
                <MdOutgoingMail className="footer__icon" />{" "}
                huyanhstudio@gmail.com
              </p>
              <p className="footer__text">
                <FaLocationDot className="footer__icon" /> Tân Bình, TP.HCM
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="col-xl-3 col-md-6">
            <div className="footer__block">
              <h6 className="footer__title">Dịch vụ</h6>
              <ul className="footer__list">
                <li className="footer__item">
                  <a href="#services">Recording</a>
                </li>
                <li className="footer__item">
                  <a href="#services">Mixing mastering</a>
                </li>
                <li className="footer__item">
                  <a href="#services">Phối beat</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="col-xl-3 col-md-6">
            <div className="footer__block">
              <h6 className="footer__title">Công ty</h6>
              <ul className="footer__list">
                <li className="footer__item">
                  <a href=""></a>
                </li>
                <li className="footer__item">Tuyển dụng</li>
                <li className="footer__item">Điều khoản</li>
                <li className="footer__item">Chính sách bảo mật</li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="col-xl-3 col-md-6">
            <div className="footer__block">
              <h6 className="footer__title">Theo dõi chúng tôi</h6>
              <div className="footer__social">
                <a href="https://www.tiktok.com/@huyanhproduction?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"><FaTiktok className="footer__icon" /></a>
                <a
                  href="https://www.facebook.com/HUYANHPR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className="footer__icon" />
                </a>
                <FaInstagram className="footer__icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom copyright */}
      <div className="footer__bottom">
        <p className="footer__copy">
          © 2025 HuyAnh Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
