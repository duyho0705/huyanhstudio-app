import "../../styles/Footer.scss";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { CiPhone } from "react-icons/ci";
import { MdOutgoingMail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Studio Info */}
          <div className="col-xl-3">
            <div className="footer__studio">
              <h5 className="footer__title">HuyAnh Studio</h5>
              <p>
                Phòng thu âm sáng, hiện đại tại TP.HCM. Đặt lịch linh hoạt –
                dịch vụ tận tâm.
              </p>
              <p>
                <CiPhone className="footer__icon" />
                0901 234 567
              </p>
              <p>
                <MdOutgoingMail className="footer__icon" />
                huyanhstudio@gmail.com
              </p>
              <p>
                <FaLocationDot className="footer__icon" />
                Tân Bình, TP.HCM
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="col-xl-3">
            <div className="footer__services">
              <h6 className="footer__title">Dịch vụ</h6>
              <ul>
                <li>Recording</li>
                <li>Mixing mastering</li>
                <li>Phối beat</li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="col-xl-3">
            <div className="footer__company">
              <h6 className="footer__title">Công ty</h6>
              <ul>
                <li>Về chúng tôi</li>
                <li>Tuyển dụng</li>
                <li>Điều khoản</li>
                <li>Chính sách bảo mật</li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="col-xl-3">
            <div className="footer__social">
              <h6 className="footer__title">Theo dõi chúng tôi</h6>
              <div className="footer__icons">
                <FaTiktok className="footer__icon" />
                <FaFacebookF className="footer__icon" />
                <FaInstagram className="footer__icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2025 HuyAnh Studio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
