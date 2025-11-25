import "../../styles/Navbar.scss";
import logoImg from "../../assets/logo.png";
import { FaUser } from "react-icons/fa6";
import { useContext, useState } from "react";
import { AuthContext } from "../../api/AuthContext";
import { useModal } from "../../api/ModalContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const { openModal } = useModal();

  return (
    <header className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="navbar__logo">
          <a href="/" className="navbar__brand">
            <img src={logoImg} alt="Logo" />
            HA Studio
          </a>
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
          <a className="navbar__booking" href="#booking">
            Đặt lịch ngay
          </a>
          <button
            className="navbar__account"
            onClick={() => {
              if (user) {
                window.location.href = "/user";
              } else {
                openModal("login");
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
    </header>
  );
};

export default Navbar;
