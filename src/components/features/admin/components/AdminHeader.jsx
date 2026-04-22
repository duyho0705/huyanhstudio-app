import { useTranslation } from "react-i18next";
import useAuthStore from "../../../../stores/useAuthStore";
import useAppStore from "../../../../stores/useAppStore";
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

import { removeVietnameseTones } from "../../../../utils/removeVietnameseTones";

import AdminAccount from "../AdminAccount";
import AdminBookings from "../AdminBookings";
import AdminChangePassword from "../AdminChangePassword";

const AdminHeader = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

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
    const name = user?.customerName || "Administrator";
    return i18n.language === 'en' ? removeVietnameseTones(name) : name;
  };

  const getUserRole = () => {
    if (!user) return "Admin";
    const roles = Array.isArray(user.roles) ? user.roles : [user.role];
    if (roles.includes("ROLE_ADMIN")) return "";
    if (roles.includes("ROLE_STAFF")) return "Staff";
    return "";
  };

  const menuItems = [
    {
      key: "account",
      label: <span className="text-[13px] sm:text-[14px] font-semibold">{t("admin.header.account")}</span>,
      icon: <UserCircle size={16} className="text-blue-500" />,
      onClick: () => setAccountModal(true),
    },
    {
      key: "bookings",
      label: <span className="text-[13px] sm:text-[14px] font-semibold">{t("admin.header.notifications")}</span>,
      icon: <Calendar size={16} className="text-blue-500" />,
      onClick: () => setBookingsModal(true),
    },
    {
      key: "change-password",
      label: <span className="text-[13px] sm:text-[14px] font-semibold">{t("admin.header.change_password")}</span>,
      icon: <Lock size={16} className="text-blue-500" />,
      onClick: () => setPasswordModal(true),
    },
    { type: "divider" },
    {
      key: "home",
      label: <span className="text-[13px] sm:text-[14px] font-semibold text-slate-600">{t("admin.header.returns")}</span>,
      icon: <Home size={16} className="text-slate-400" />,
      onClick: handleGoHome,
    },
    { type: "divider" },
    {
      key: "logout",
      label: <span className="text-[13px] sm:text-[14px] font-semibold text-red-600">{t("admin.header.logout")}</span>,
      icon: <LogOut size={16} className="text-red-500" />,
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
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-100 h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 md:px-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-600 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
            className="hidden sm:flex items-center justify-center w-auto px-3 h-9 bg-[#35104C]/5 text-[13px] font-bold text-[#35104C] rounded-xl hover:bg-[#35104C]/10 transition-colors"
          >
            {i18n.language === 'vi' ? 'EN' : 'VI'}
          </button>
          
          <button className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-slate-400 rounded-none relative group">
            <Bell size={17} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm ring-2 ring-red-500/20"></span>
          </button>

          <div className="w-[1px] h-8 bg-slate-100 mx-2 hidden sm:block"></div>

          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName="[&_.ant-dropdown-menu]:!p-1 [&_.ant-dropdown-menu-item]:!py-1.5 [&_.ant-dropdown-menu-item]:!px-3 !min-w-[170px]"
          >
            <div className="flex items-center gap-2 sm:gap-4 p-1 rounded-2xl group cursor-pointer border border-transparent">
              <div className="relative">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-white">
                  <User size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-semibold text-slate-900 whitespace-nowrap">{getUserName()}</span>
                  {getUserRole() && (
                    <span className="text-[10px] font-semibold text-blue-500 tracking-[0.2em] opacity-80">{getUserRole()}</span>
                  )}
                </div>
                <ChevronDown size={14} strokeWidth={3} className="text-slate-400" />
              </div>
            </div>
          </Dropdown>
        </div>
      </header>

      {/* Notifications */}
      {notification.show && (
        <div className="fixed top-4 right-4 sm:top-10 sm:right-10 z-[2000] px-4 py-3 sm:px-8 sm:py-5 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-3 sm:gap-5 animate-in slide-in-from-right duration-500 max-w-[calc(100vw-32px)] sm:max-w-none">
          <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0 ${notification.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {notification.type === "success" ? <CheckCircle2 size={20} className="sm:w-6 sm:h-6" /> : <AlertCircle size={20} className="sm:w-6 sm:h-6" />}
          </div>
          <div className="min-w-0">
            <h5 className="font-semibold text-slate-900 tracking-tight text-[11px] sm:text-xs mb-0.5 truncate">
              {notification.type === "success" 
                ? (i18n.language === 'en' ? "OPERATION COMPLETED" : "HOÀN TẤT THAO TÁC") 
                : (i18n.language === 'en' ? "SYSTEM WARNING" : "CẢNH BÁO HỆ THỐNG")}
            </h5>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Account Modal */}
      <Modal
        open={accountModal}
        onCancel={() => setAccountModal(false)}
        footer={null}
        width={700}
        className="!max-w-[95vw]"
        centered
        closable={false}
      >
        <div className="p-4 sm:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{t('admin.header.update_profile')}</h3>
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
        className="!max-w-[95vw]"
        centered
        closable={false}
      >
        <div className="p-4 sm:p-8">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{t('admin.header.system_history')}</h3>
              </div>
            </div>
            <button onClick={() => setBookingsModal(false)} className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Home size={16} className="sm:w-[18px] sm:h-[18px]" />
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
        className="!max-w-[95vw]"
        centered
        closable={false}
      >
        <div className="p-4 sm:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div className="w-1.5 h-6 sm:h-8 bg-red-500 rounded-full"></div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{t('admin.header.security')}</h3>
            </div>
          </div>
          <AdminChangePassword onClose={() => setPasswordModal(false)} />
        </div>
      </Modal>
    </>
  );
};

export default AdminHeader;
