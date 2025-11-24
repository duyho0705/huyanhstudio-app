import { TbLogout } from "react-icons/tb";
import { MdLockOutline } from "react-icons/md";
import { LuCalendar } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import { useContext, useState } from "react";
import { AuthContext } from "../../../api/AuthContext";
import Account from "./Account";
import BookingProfile from "../booking/BookingProfile";
import ChangePassword from "./ChangePassword";
import "../../../styles/User.scss";
const User = () => {
  const [activeOption, setActiveOption] = useState("account");
  const { logout } = useContext(AuthContext);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-xl-4">
            <div className="option">
              <h3 className="option__hello">Xin chào bạn!</h3>
              <div className="option__choose">
                <button
                  className={`button option__account-button ${
                    activeOption === "account" ? "active" : ""
                  }`}
                  onClick={() => setActiveOption("account")}
                >
                  <FaUser className="option__icon" />
                  Tài khoản của tôi
                </button>
                <button
                  className={`button option__booking-button ${
                    activeOption === "booking" ? "active" : ""
                  }`}
                  onClick={() => setActiveOption("booking")}
                >
                  <LuCalendar className="option__icon" />
                  Thông tin đặt lịch
                </button>
                <button
                  className={`button option__change-password-button ${
                    activeOption === "change-password" ? "active" : ""
                  }`}
                  onClick={() => setActiveOption("change-password")}
                >
                  <MdLockOutline className="option__icon" />
                  Đổi mật khẩu
                </button>
                <button
                  className="button option__logout-button"
                  style={{ color: "#e8412f" }}
                  onClick={logout}
                >
                  <TbLogout
                    className="option__icon"
                    style={{ color: "#e8412f" }}
                  />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            {activeOption === "account" && <Account />}
            {activeOption === "booking" && <BookingProfile />}
            {activeOption === "change-password" && <ChangePassword />}
          </div>
        </div>
      </div>
    </>
  );
};
export default User;
