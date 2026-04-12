import { TbLogout } from "react-icons/tb";
import { MdLockOutline } from "react-icons/md";
import { LuCalendar } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../api/AuthContext";
import Account from "./Account";
import BookingProfile from "../booking/BookingProfile";
import ChangePassword from "./ChangePassword";
import StudioBackground from "../../layout/StudioBackground";

const menuItems = [
  { key: "account", label: "Tài khoản của tôi", icon: FaUser },
  { key: "booking", label: "Thông tin đặt lịch", icon: LuCalendar },
  { key: "change-password", label: "Đổi mật khẩu", icon: MdLockOutline },
];

const User = () => {
  const [activeOption, setActiveOption] = useState("account");
  const [openDropdown, setOpenDropdown] = useState(false);
  const { logout } = useContext(AuthContext);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const activeItem = menuItems.find((m) => m.key === activeOption);
  const ActiveIcon = activeItem?.icon;

  const handleSelect = (value) => {
    if (value === "logout") { logout(); return; }
    setActiveOption(value); setOpenDropdown(false);
  };

  return (
    <div className="container-app">
      {/* Mobile Dropdown */}
      <div className="lg:hidden relative mb-6">
        <div
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer"
          onClick={() => setOpenDropdown((p) => !p)}
        >
          {ActiveIcon && <ActiveIcon className="text-blue-600" />}
          <span className="text-sm font-medium text-gray-800">{activeItem?.label}</span>
          <span className="ml-auto text-gray-400 text-xs">▼</span>
        </div>
        {openDropdown && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-slide-down">
            {menuItems.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => handleSelect(key)}>
                <Icon className="text-gray-400" /> {label}
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 cursor-pointer border-t border-gray-100" onClick={() => handleSelect("logout")}>
              <TbLogout /> Đăng xuất
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Xin chào bạn!</h3>
            <div className="flex flex-col gap-1">
              {menuItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeOption === key
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => setActiveOption(key)}
                >
                  <Icon className={activeOption === key ? "text-blue-600" : "text-gray-400"} />
                  {label}
                </button>
              ))}
              <button
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all text-left mt-2"
                onClick={logout}
              >
                <TbLogout className="text-red-400" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8">
            {activeOption === "account" && <Account />}
            {activeOption === "booking" && <BookingProfile />}
            {activeOption === "change-password" && <ChangePassword />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
