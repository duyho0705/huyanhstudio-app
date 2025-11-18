import "../../styles/Navbar.scss";
import logoImg from "../../assets/logo.jpg";
import { FaUser } from "react-icons/fa6";
import { MdCall } from "react-icons/md";
import { useContext, useState } from "react";
import LoginModal from "./LoginModal";
import { AuthContext } from "../../api/AuthContext";
const Navbar = () => {
  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleUserClick = () => {
    window.location.href = "/user";
  };

  const toggleForm = () => {
    setShowForm((prev) => {
      const newValue = !prev;
      document.body.style.overflow = newValue ? "hidden" : "auto";
      return newValue;
    });
  };

  return (
    <header className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="navbar__logo">
          <span
            className="navbar__brand"
            onClick={() => (window.location.href = "/")}
          >
            <img src={logoImg} alt="Logo" />
            HA Studio
          </span>
        </div>

        {/* Menu desktop */}
        <nav className="navbar__menu">
          <a href="#introduction" className="navbar__link">
            Giới thiệu
          </a>
          <a href="#products" className="navbar__link">
            Sản phẩm
          </a>
          <a href="#services" className="navbar__link">
            Dịch vụ
          </a>
          <a href="#pricing" className="navbar__link">
            Bảng giá
          </a>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <a
            href="https://www.facebook.com/HUYANHPR"
            className="navbar__contact"
            target="_blank"
          >
            <MdCall />
            Liên hệ
          </a>
          <a className="navbar__booking" href="#booking">
            Đặt lịch ngay
          </a>
          <button
            className="navbar__account"
            onClick={() => {
              if (user) {
                // đã đăng nhập → vào trang user
                window.location.href = "/user";
              } else {
                // chưa đăng nhập → mở form login
                toggleForm();
              }
            }}
          >
            <FaUser />
          </button>
        </div>

        {/* Toggle mobile */}
        <div className="navbar__toggle" onClick={() => setOpen(!open)}>
          ☰
        </div>
      </div>

      {/* Menu mobile */}

      {/* Menu mobile */}
      <div className="container" style={{ position: "relative" }}>
        <div className={`navbar__mobile-menu ${open ? "active" : ""}`}>
          <a href="#introduction" onClick={() => setOpen(false)}>
            Giới thiệu
          </a>
          <a href="#products" onClick={() => setOpen(false)}>
            Sản phẩm
          </a>
          <a href="#services" onClick={() => setOpen(false)}>
            Dịch vụ
          </a>
          <a href="#pricing" onClick={() => setOpen(false)}>
            Bảng giá
          </a>
          <a href="#booking" onClick={() => setOpen(false)}>
            Đặt lịch
          </a>
        </div>
      </div>
      <LoginModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          document.body.style.overflow = "auto";
        }}
      />
    </header>
  );
};

export default Navbar;
