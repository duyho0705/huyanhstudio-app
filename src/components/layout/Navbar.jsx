import "../../styles/Navbar.scss";
import logoImg from "../../assets/logo.png";
import { FaUser } from "react-icons/fa6";
import { MdCall } from "react-icons/md";
import { useContext, useState } from "react";
import LoginModal from "../features/auth/LoginModal";
import { AuthContext } from "../../api/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
          <a href="/" className="navbar__brand">
            <img src={logoImg} alt="Logo" />
            HA Studio
          </a>
        </div>

        {/* Menu desktop */}
        <nav className="navbar__menu">
          <a
            href={
              window.location.pathname === "/"
                ? "#introduction"
                : "/#introduction"
            }
            className="navbar__link"
          >
            Giới thiệu
          </a>
          <a
            href={window.location.pathname === "/" ? "#products" : "/#products"}
            className="navbar__link"
          >
            Sản phẩm
          </a>
          <a
            href={window.location.pathname === "/" ? "#services" : "/#services"}
            className="navbar__link"
          >
            Dịch vụ
          </a>
          <a
            href={window.location.pathname === "/" ? "#pricing" : "/#pricing"}
            className="navbar__link"
          >
            Bảng giá
          </a>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <a
            className="navbar__booking"
            href={window.location.pathname === "/" ? "#booking" : "/#booking"}
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
          href={
            window.location.pathname === "/"
              ? "#introduction"
              : "/#introduction"
          }
          onClick={() => setOpen(false)}
        >
          Giới thiệu
        </a>
        <a
          href={window.location.pathname === "/" ? "#products" : "/#products"}
          onClick={() => setOpen(false)}
        >
          Sản phẩm
        </a>
        <a
          href={window.location.pathname === "/" ? "#services" : "/#services"}
          onClick={() => setOpen(false)}
        >
          Dịch vụ
        </a>
        <a
          href={window.location.pathname === "/" ? "#pricing" : "/#pricing"}
          onClick={() => setOpen(false)}
        >
          Bảng giá
        </a>
        <a
          href={window.location.pathname === "/" ? "#booking" : "/#booking"}
          onClick={() => setOpen(false)}
        >
          Đặt lịch
        </a>
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
