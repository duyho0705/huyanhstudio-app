import "../../styles/Navbar.scss";
import logoImg from "../../assets/logo.png";
import { FaUser } from "react-icons/fa6";
import { MdCall } from "react-icons/md";
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../features/auth/LoginModal";
import { AuthContext } from "../../api/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm((prev) => {
      const newValue = !prev;
      document.body.style.overflow = newValue ? "hidden" : "auto";
      return newValue;
    });
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      window.location.hash = sectionId;
    }
  };

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
          <a
            href="#introduction"
            onClick={(e) => handleNavClick(e, "introduction")}
            className="navbar__link"
          >
            Giới thiệu
          </a>
          <a
            href="#products"
            onClick={(e) => handleNavClick(e, "products")}
            className="navbar__link"
          >
            Sản phẩm
          </a>
          <a
            href="#services"
            onClick={(e) => handleNavClick(e, "services")}
            className="navbar__link"
          >
            Dịch vụ
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleNavClick(e, "pricing")}
            className="navbar__link"
          >
            Bảng giá
          </a>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <a
            className="navbar__booking"
            href="#booking"
            onClick={(e) => handleNavClick(e, "booking")}
          >
            Đặt lịch ngay
          </a>
          <button
            className="navbar__account"
            onClick={() => {
              if (user) {
                window.location.href = "/user";
              } else {
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
      <div className={`navbar__mobile-menu ${open ? "active" : ""}`}>
        <a
          href="#introduction"
          onClick={(e) => {
            handleNavClick(e, "introduction");
            setOpen(false);
          }}
        >
          Giới thiệu
        </a>
        <a
          href="#products"
          onClick={(e) => {
            handleNavClick(e, "products");
            setOpen(false);
          }}
        >
          Sản phẩm
        </a>
        <a
          href="#services"
          onClick={(e) => {
            handleNavClick(e, "services");
            setOpen(false);
          }}
        >
          Dịch vụ
        </a>
        <a
          href="#pricing"
          onClick={(e) => {
            handleNavClick(e, "pricing");
            setOpen(false);
          }}
        >
          Bảng giá
        </a>

        {/* Mobile actions */}
        <div className="navbar__mobile-actions">
          <a
            className="navbar__booking"
            href="#booking"
            onClick={(e) => {
              handleNavClick(e, "booking");
              setOpen(false);
            }}
          >
            Đặt lịch ngay
          </a>
          <button
            className="navbar__account"
            onClick={() => {
              setOpen(false);
              if (user) {
                window.location.href = "/user";
              } else {
                toggleForm();
              }
            }}
          >
            <FaUser />
            <span>{user ? "Tài khoản" : "Đăng nhập"}</span>
          </button>
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
