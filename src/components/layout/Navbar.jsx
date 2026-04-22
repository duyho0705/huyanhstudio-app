import useAuthStore from "../../stores/useAuthStore";
import useAppStore from "../../stores/useAppStore";
import logoImg from "../../assets/logo.png";
import { FaUser } from "react-icons/fa6";
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../features/auth/LoginModal";

const OFFSET = 100;

const Navbar = () => {
  const user = useAuthStore(state => state.user);
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
    window.scrollTo({ top: top - OFFSET, behavior: "smooth" });
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
      return;
    }
    smoothScrollToSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 no-underline">
            <img src={logoImg} alt="Logo" className="h-9 w-auto rounded-xl object-contain" />
            HA
          </a>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            ["Giới thiệu", "introduction"],
            ["Sản phẩm", "products"],
            ["Dịch vụ", "services"],
            ["Bảng giá", "pricing"],
          ].map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleNavClick(e, id)}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 rounded-full hover:opacity-90 transition-all no-underline shadow-md shadow-blue-200"
            href="#booking"
            onClick={(e) => handleNavClick(e, "booking")}
          >
            Đặt lịch ngay
          </a>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all bg-white"
            onClick={() => {
              if (user) {
                window.location.href = "/user";
              } else {
                toggleForm();
              }
            }}
          >
            <FaUser className="text-sm" />
          </button>
        </div>

        {/* Toggle mobile */}
        <div
          className="md:hidden text-2xl cursor-pointer text-gray-600 hover:text-gray-900 p-2"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
      >
        <div className="flex flex-col py-4 px-6 gap-1">
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
              className="py-3 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline border-b border-gray-50"
            >
              {label}
            </a>
          ))}

          {/* Mobile actions */}
          <div className="flex items-center gap-3 pt-4">
            <a
              className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 rounded-full no-underline"
              href="#booking"
              onClick={(e) => {
                handleNavClick(e, "booking");
                setOpen(false);
              }}
            >
              Đặt lịch ngay
            </a>
            <button
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:border-blue-400 bg-white"
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
