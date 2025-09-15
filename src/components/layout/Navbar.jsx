import "../../styles/Navbar.scss";
import logoImg from "../../assets/logo.jpg";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <div className="navbar__logo">
          <span
            className="navbar__brand"
            onClick={() => (window.location.href = "/")}
          >
            <img src={logoImg} alt="Logo" />
            HA Studio
          </span>
        </div>

        <nav className="navbar__menu">
          <a href="#introduction" className="navbar__link">Giới thiệu</a>
          <a href="#products" className="navbar__link">Sản phẩm</a>
          <a href="#services" className="navbar__link">Dịch vụ</a>
          <a href="#pricing" className="navbar__link">Bảng giá</a>
          <a href="#booking" className="navbar__link">Đặt lịch</a>
        </nav>

        <div className="navbar__actions">
          <a href="#booking" className="navbar__btn navbar__btn--primary">Book now</a>
          <a
            href="https://www.facebook.com/HUYANHPR"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__btn navbar__btn--secondary"
          >
            Liên hệ
          </a>
        </div>

        {/* Nút toggle menu mobile */}
        <div className="navbar__toggle" onClick={() => setOpen(!open)}>
          ☰
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`navbar__mobile-menu ${open ? "active" : ""}`}>
        <a href="#introduction" onClick={() => setOpen(false)}>Giới thiệu</a>
        <a href="#products" onClick={() => setOpen(false)}>Sản phẩm</a>
        <a href="#services" onClick={() => setOpen(false)}>Dịch vụ</a>
        <a href="#pricing" onClick={() => setOpen(false)}>Bảng giá</a>
        <a href="#booking" onClick={() => setOpen(false)}>Đặt lịch</a>
      </div>
    </header>
  );
};

export default Navbar;
