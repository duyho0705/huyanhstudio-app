import "../../styles/Navbar.scss";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container navbar__container">
        <div className="navbar__logo">
          <span
            className="navbar__brand"
            onClick={() => window.location.href='/'}
          >
            HA Studio
          </span>
        </div>

        <nav className="navbar__menu">
          <a href="#introduction" className="navbar__link">
            Giới thiệu
          </a>
          <a href="#services" className="navbar__link">
            Dịch vụ
          </a>
          <a href="#products" className="navbar__link">
            Sản phẩm
          </a>
          <a href="#booking" className="navbar__link">
            Đặt lịch
          </a>
          <a href="#pricing" className="navbar__link">
            Bảng giá
          </a>
        </nav>

        <div className="navbar__actions">
          <a href="#booking" className="navbar__btn navbar__btn--primary">
            Book now
          </a>
          <a
            href="https://www.facebook.com/HUYANHPR"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__btn navbar__btn--secondary"
          >
            Liên hệ
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
