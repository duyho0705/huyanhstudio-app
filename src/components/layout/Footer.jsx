import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { CiPhone } from "react-icons/ci";
import { MdOutgoingMail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import logoImg from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-6">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gray-700/50">
          {/* Studio Info */}
          <div>
            <span
              className="flex items-center gap-2 text-white text-xl font-bold cursor-pointer mb-4"
              onClick={() => (window.location.href = "/")}
            >
              <img
                src={logoImg}
                alt="Logo"
                className="h-10 w-auto object-contain rounded-xl -rotate-1"
              />
              HA Studio
            </span>
            <p className="text-sm text-gray-400 leading-relaxed mb-3">
              Phòng thu âm sáng, hiện đại tại TP.HCM. Đặt lịch linh hoạt – dịch vụ tận tâm.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <CiPhone className="text-lg text-gray-500" /> 0393248014
              </p>
              <p className="flex items-center gap-2">
                <MdOutgoingMail className="text-lg text-gray-500" /> hastudio@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <FaLocationDot className="text-base text-gray-500" /> Tân Bình, TP.HCM
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h6 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Dịch vụ</h6>
            <ul className="flex flex-col gap-2.5">
              {["Recording", "Mixing mastering", "Phối beat"].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h6 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Theo dõi chúng tôi</h6>
            <div className="flex gap-4">
              <a
                href="https://www.tiktok.com/@huyanhproduction?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.facebook.com/HUYANHPR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <FaFacebookF />
              </a>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-pink-500 hover:text-white transition-all cursor-pointer">
                <FaInstagram />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 text-center">
          <p className="text-xs text-gray-500">© 2025 HA Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
