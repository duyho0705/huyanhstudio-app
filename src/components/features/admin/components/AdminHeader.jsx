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
  ShieldCheck
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
    if (roles.includes("ROLE_ADMIN")) return "Hệ thống / Admin";
    if (roles.includes("ROLE_STAFF")) return "Nhân viên / Staff";
    return "Người dùng";
  };

  const menuItems = [
    {
      key: "status",
      label: (
        <div className="px-1 py-2 mb-2 border-b border-slate-50">
            <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hệ thống đang trực tuyến</span>
            </div>
        </div>
      ),
      disabled: true,
    },
    {
      key: "account",
      label: <span className="text-xs font-bold uppercase tracking-tight">Hồ sơ cá nhân</span>,
      icon: <UserCircle size={14} className="text-blue-500" />,
      onClick: () => setAccountModal(true),
    },
    {
      key: "bookings",
      label: <span className="text-xs font-bold uppercase tracking-tight">Thông báo đặt lịch</span>,
      icon: <Calendar size={14} className="text-blue-500" />,
      onClick: () => setBookingsModal(true),
    },
    {
      key: "change-password",
      label: <span className="text-xs font-bold uppercase tracking-tight">Cài đặt bảo mật</span>,
      icon: <Lock size={14} className="text-blue-500" />,
      onClick: () => setPasswordModal(true),
    },
    { type: "divider" },
    {
      key: "home",
      label: <span className="text-xs font-bold uppercase tracking-tight text-slate-600">Xem website chính</span>,
      icon: <Home size={14} className="text-slate-400" />,
      onClick: handleGoHome,
    },
    { type: "divider" },
    {
      key: "logout",
      label: <span className="text-xs font-black uppercase tracking-widest text-red-600">Thoát hệ thống</span>,
      icon: <LogOut size={14} className="text-red-500" />,
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
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:tracking-widest w-48 lg:w-64"
             />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 mr-4">
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Zap size={10} fill="currentColor" />
                 Server Status: Stable
              </div>
          </div>

          <button className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all relative group">
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
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                     <ShieldCheck size={10} className="text-white" />
                  </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">{getUserName()}</span>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    {getUserRole()}
                    <ChevronDown size={10} strokeWidth={3} className="group-hover:translate-y-0.5 transition-transform" />
                </span>
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
                <h5 className="font-black text-slate-900 tracking-tight uppercase text-xs mb-0.5">{notification.type === "success" ? "HOÀN TẤT THAO TÁC" : "CẢNH BÁO HỆ THỐNG"}</h5>
                <p className="text-xs text-slate-500 font-medium">{notification.message}</p>
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
                   <h3 className="text-xl font-black text-slate-900 uppercase">Cập nhật hồ sơ</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Thông tin định danh quản trị viên</p>
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
                        <h3 className="text-xl font-black text-slate-900 uppercase">Lịch sử hệ thống</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dữ liệu đặt lịch từ phía khách hàng</p>
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
                    <h3 className="text-xl font-black text-slate-900 uppercase">Bảo mật tài khoản</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Thay đổi mật khẩu đăng nhập</p>
                </div>
            </div>
            <AdminChangePassword onClose={() => setPasswordModal(false)} />
        </div>
      </Modal>
    </>
  );
};

export default AdminHeader;
