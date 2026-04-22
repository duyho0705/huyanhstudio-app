import useAuthStore from "../../../../stores/useAuthStore";
import useAppStore from "../../../../stores/useAppStore";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  Layers,
  Users,
  MessageCircle,
  Music2,
  LogOut
} from "lucide-react";



const AdminSidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const logout = useAuthStore(state => state.logout);
  const location = useLocation();

  const menuItems = [
    {
      path: "/admin",
      icon: <LayoutDashboard size={22} />,
      label: t('admin.sidebar.dashboard'),
      end: true,
    },
    {
      path: "/admin/chat",
      icon: <MessageCircle size={22} />,
      label: t('admin.sidebar.chat'),
    },
    {
      path: "/admin/bookings",
      icon: <CalendarDays size={22} />,
      label: t('admin.sidebar.bookings'),
    },
    {
      path: "/admin/products",
      icon: <Package size={22} />,
      label: t('admin.sidebar.products'),
    },
    {
      path: "/admin/services",
      icon: <Layers size={22} />,
      label: t('admin.sidebar.services'),
    },
    {
      path: "/admin/users",
      icon: <Users size={22} />,
      label: t('admin.sidebar.users'),
    },
  ];

  // Calculate active index for sliding indicator
  const activeIndex = menuItems.findIndex(item => {
    if (item.end) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  });

  return (
    <aside
      className={`fixed left-0 top-0 z-[1000] h-screen w-[260px] bg-white border-r border-slate-100 flex flex-col transition-all duration-500 transform lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl ring-1 ring-black/5" : "-translate-x-full"
        }`}
    >
      {/* LOGO SECTION */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-[#35104C] blur-xl opacity-20"></div>
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-brand-orange rounded-md rotate-12"></div>
              <div className="absolute inset-0 bg-[#6CD1FD] rounded-md -rotate-6"></div>
              <div className="absolute inset-0 bg-[#35104C] rounded-md flex items-center justify-center text-white text-[10px] font-black">HA</div>
            </div>
          </div>
          <div className="flex flex-col relative z-10 -translate-y-0.5">
            <span
              className="text-2xl font-bold text-[#35104C] leading-none"
              style={{ fontFamily: '"Satisfy", cursive' }}
            >
              hastudio
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-hide py-2 relative">
        {/* Sliding Active Indicator */}
        {activeIndex !== -1 && (
          <div 
            className="absolute left-3 right-3 bg-[#35104C] rounded-xl transition-all duration-300 ease-out z-0 h-[48px] shadow-lg shadow-[#35104C]/20"
            style={{ 
              top: `${8 + activeIndex * (48 + 4)}px`, // 8px padding + index * (height + gap)
            }}
          />
        )}

        <div className="space-y-1 relative z-10">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 h-[48px] rounded-xl transition-colors duration-300 leading-none ${isActive
                  ? "text-white"
                  : "text-slate-600 active:bg-slate-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3.5">
                    <span className={``}>
                      {item.icon}
                    </span>
                    <span className="text-[15px] font-semibold tracking-tight">{item.label}</span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* LOGOUT SECTION */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3.5 px-4 h-[48px] w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200 font-bold text-[15px]"
        >
          <LogOut size={20} />
          <span>{t('admin.sidebar.returns')}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
