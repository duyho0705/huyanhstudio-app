import { useContext, useState } from "react";
import { Dropdown, Modal } from "antd";
import {
  Home,
  LogOut,
  ChevronDown,
  User,
  UserCircle,
  Calendar,
  Lock,
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Zap,

} from "lucide-react";
import { AuthContext } from "../../../../api/AuthContext";
import AdminAccount from "../AdminAccount";
import AdminBookings from "../AdminBookings";
import AdminChangePassword from "../AdminChangePassword";

const AdminHeader = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  const [accountModal, setAccountModal] = useState(false);
  const [bookingsModal, setBookingsModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleGoHome = () => {
    window.open("/", "_blank", "noopener,noreferrer");
  };

  const getUserName = () => {
    return user?.customerName || "Administrator";
  };

  const getUserRole = () => {
    if (!user) return "Admin";
    const roles = Array.isArray(user.roles) ? user.roles : [user.role];
    if (roles.includes("ROLE_ADMIN")) return "";
    if (roles.includes("ROLE_STAFF")) return "Nhân viên / Staff";
    return "Người dùng";
  };

  const menuItems = [

    {
      key: "account",
      label: <span className="text-[15px] font-semibold">Hồ sơ cá nhân</span>,
      icon: <UserCircle size={18} className="text-blue-500" />,
      onClick: () => setAccountModal(true),
    },
    {
      key: "bookings",
      label: <span className="text-[15px] font-semibold">Thông báo đặt lịch</span>,
      icon: <Calendar size={18} className="text-blue-500" />,
      onClick: () => setBookingsModal(true),
    },
    {
      key: "change-password",
      label: <span className="text-[15px] font-semibold">Thiết lập mật khẩu</span>,
      icon: <Lock size={18} className="text-blue-500" />,
      onClick: () => setPasswordModal(true),
    },
    { type: "divider" },
    {
      key: "home",
      label: <span className="text-[15px] font-semibold text-slate-600">Xem website chính</span>,
      icon: <Home size={18} className="text-slate-400" />,
      onClick: handleGoHome,
    },
    { type: "divider" },
    {
      key: "logout",
      label: <span className="text-[15px] font-semibold text-red-600">Thoát hệ thống</span>,
      icon: <LogOut size={18} className="text-red-500" />,
      onClick: logout,
    },
  ];

  const handleAccountClose = (result) => {
    setAccountModal(false);
    if (result?.success) {
      setNotification({
        show: true,
        message: result.message,
        type: "success",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-100 h-20 flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-6">
          <button
            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-all active:scale-90 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-slate-50/50 rounded-2xl border border-slate-100 group transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100 focus-within:border-slate-200">
            <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Truy vấn hệ thống..."
              className="bg-transparent border-none outline-none text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-semibold placeholder:tracking-widest w-48 lg:w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">


          <button className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-none transition-all relative group">
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm ring-2 ring-red-500/20"></span>
          </button>

          <div className="w-[1px] h-8 bg-slate-100 mx-2 hidden sm:block"></div>

          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div className="flex items-center gap-4 p-1 rounded-2xl hover:bg-slate-50 group cursor-pointer transition-all border border-transparent hover:border-slate-100">
              <div className="relative">
                <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 transition-transform group-hover:scale-95">
                  <User size={20} />
                </div>

              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-semibold text-slate-900 whitespace-nowrap">{getUserName()}</span>
                  {getUserRole() && (
                    <span className="text-[10px] font-semibold text-blue-500 tracking-[0.2em] opacity-80">{getUserRole()}</span>
                  )}
                </div>
                <ChevronDown size={14} strokeWidth={3} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Dropdown>
        </div>
      </header>

      {/* Notifications */}
      {notification.show && (
        <div className="fixed top-10 right-10 z-[2000] px-8 py-5 bg-white rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-5 animate-in slide-in-from-right duration-500">
          <div className={`p-3 rounded-2xl ${notification.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {notification.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <h5 className="font-semibold text-slate-900 tracking-tight text-xs mb-0.5">{notification.type === "success" ? "HOÀN TẤT THAO TÁC" : "CẢNH BÁO HỆ THỐNG"}</h5>
            <p className="text-xs text-slate-500 font-semibold">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Account Modal */}
      <Modal
        open={accountModal}
        onCancel={() => setAccountModal(false)}
        footer={null}
        width={700}
        centered
        closable={false}
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Cập nhật hồ sơ</h3>
            </div>
          </div>
          <AdminAccount onClose={handleAccountClose} isOpen={accountModal} />
        </div>
      </Modal>

      {/* Bookings Modal */}
      <Modal
        open={bookingsModal}
        onCancel={() => setBookingsModal(false)}
        footer={null}
        width={1000}
        centered
        closable={false}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Lịch sử hệ thống</h3>
              </div>
            </div>
            <button onClick={() => setBookingsModal(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <Home size={18} />
            </button>
          </div>
          <AdminBookings />
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        open={passwordModal}
        onCancel={() => setPasswordModal(false)}
        footer={null}
        width={500}
        centered
        closable={false}
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Bảo mật tài khoản</h3>
            </div>
          </div>
          <AdminChangePassword onClose={() => setPasswordModal(false)} />
        </div>
      </Modal>
    </>
  );
};

export default AdminHeader;
