import "../../styles/Navbar.scss";
import logoImg from "../../assets/logo.png";
import { FaUser } from "react-icons/fa6";
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../features/auth/LoginModal";
import { AuthContext } from "../../api/AuthContext";

const OFFSET = 100;

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

  const smoothScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: top - OFFSET,
      behavior: "smooth",
    });

    window.history.replaceState(null, "", `#${sectionId}`);
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();

    // Nếu đang ở trang khác => quay về "/" và yêu cầu scroll
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
      return;
    }

    // Nếu đang ở trang "/" => scroll tại chỗ
    smoothScrollToSection(sectionId);
  };

  return (
    <header className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="navbar__logo">
          <a href="/" className="navbar__brand">
            <img src={logoImg} alt="Logo" />
            HA
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
        {[
          ["Giới thiệu", "introduction"],
          ["Sản phẩm", "products"],
          ["Dịch vụ", "services"],
          ["Bảng giá", "pricing"],
        ].map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              handleNavClick(e, id);
              setOpen(false);
            }}
          >
            {label}
          </a>
        ))}

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

      {/* Modal */}
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
