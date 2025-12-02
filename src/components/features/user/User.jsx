import { TbLogout } from "react-icons/tb";
import { MdLockOutline } from "react-icons/md";
import { LuCalendar } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../api/AuthContext";
import Account from "./Account";
import BookingProfile from "../booking/BookingProfile";
import ChangePassword from "./ChangePassword";
import "../../../styles/User.scss";

const User = () => {
  const [activeOption, setActiveOption] = useState("account");
  const [openDropdown, setOpenDropdown] = useState(false);
  const { logout } = useContext(AuthContext);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (value) => {
    if (value === "logout") {
      logout();
      return;
    }
    setActiveOption(value);
    setOpenDropdown(false);
  };

  return (
    <>
      <div className="user-page">
        <div className="container">
          {/* ---------- DROPDOWN MOBILE ---------- */}
          <div className="option-dropdown d-lg-none">
            <div
              className="option-dropdown__selected"
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              {activeOption === "account" && (
                <>
                  <FaUser className="icon" /> Tài khoản của tôi
                </>
              )}
              {activeOption === "booking" && (
                <>
                  <LuCalendar className="icon" /> Thông tin đặt lịch
                </>
              )}
              {activeOption === "change-password" && (
                <>
                  <MdLockOutline className="icon" /> Đổi mật khẩu
                </>
              )}
              {activeOption === "logout" && (
                <>
                  <TbLogout /> Đăng xuất
                </>
              )}
            </div>

            {openDropdown && (
              <div className="option-dropdown__menu">
                <div className="item" onClick={() => handleSelect("account")}>
                  <FaUser /> Tài khoản của tôi
                </div>
                <div className="item" onClick={() => handleSelect("booking")}>
                  <LuCalendar /> Thông tin đặt lịch
                </div>
                <div
                  className="item"
                  onClick={() => handleSelect("change-password")}
                >
                  <MdLockOutline /> Đổi mật khẩu
                </div>
                <div
                  className="item logout"
                  onClick={() => handleSelect("logout")}
                >
                  <TbLogout /> Đăng xuất
                </div>
              </div>
            )}
          </div>

          <div className="row">
            {/* ---------- SIDEBAR DESKTOP ---------- */}
            <div className="col-xl-4 col-lg-4 col-md-4 d-none d-lg-block">
              <div className="option">
                <h3 className="option__hello">Xin chào bạn!</h3>
                <div className="option__choose">
                  <button
                    className={`button ${
                      activeOption === "account" ? "active" : ""
                    }`}
                    onClick={() => setActiveOption("account")}
                  >
                    <FaUser className="option__icon" />
                    Tài khoản của tôi
                  </button>
                  <button
                    className={`button ${
                      activeOption === "booking" ? "active" : ""
                    }`}
                    onClick={() => setActiveOption("booking")}
                  >
                    <LuCalendar className="option__icon" />
                    Thông tin đặt lịch
                  </button>
                  <button
                    className={`button ${
                      activeOption === "change-password" ? "active" : ""
                    }`}
                    onClick={() => setActiveOption("change-password")}
                  >
                    <MdLockOutline className="option__icon" />
                    Đổi mật khẩu
                  </button>
                  <button
                    className="button option__logout-button"
                    onClick={logout}
                  >
                    <TbLogout className="option__icon" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            {/* ---------- CONTENT AREA ---------- */}
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 content-area">
              <div
                className={activeOption === "account" ? "d-block" : "d-none"}
              >
                <Account />
              </div>
              <div
                className={activeOption === "booking" ? "d-block" : "d-none"}
              >
                <BookingProfile />
              </div>
              <div
                className={
                  activeOption === "change-password" ? "d-block" : "d-none"
                }
              >
                <ChangePassword />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
