import { NavLink, useLocation } from "react-router-dom";
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
import { useContext } from "react";
import { AuthContext } from "../../../../api/AuthContext";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    {
      path: "/admin",
      icon: <LayoutDashboard size={22} />,
      label: "Bảng điều khiển",
      end: true,
    },
    {
      path: "/admin/chat",
      icon: <MessageCircle size={22} />,
      label: "Tin nhắn",
    },
    {
      path: "/admin/bookings",
      icon: <CalendarDays size={22} />,
      label: "Lịch thu âm",
    },
    {
      path: "/admin/products",
      icon: <Package size={22} />,
      label: "Kho sản phẩm",
    },
    {
      path: "/admin/services",
      icon: <Layers size={22} />,
      label: "Gói dịch vụ",
    },
    {
      path: "/admin/users",
      icon: <Users size={22} />,
      label: "Người dùng",
    },
  ];

  // Calculate active index for sliding indicator
  const activeIndex = menuItems.findIndex(item => {
    if (item.end) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  });

  return (
    <aside
      className={`fixed left-0 top-0 z-[1000] h-screen w-[280px] bg-white border-r border-slate-100 flex flex-col transition-all duration-500 transform lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl ring-1 ring-black/5" : "-translate-x-full"
        }`}
    >
      {/* LOGO SECTION */}
      <div className="p-8 pb-12">
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 blur-xl opacity-20"></div>
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-brand-orange rounded-md rotate-12"></div>
              <div className="absolute inset-0 bg-[#6CD1FD] rounded-md -rotate-6"></div>
              <div className="absolute inset-0 bg-[#35104C] rounded-md flex items-center justify-center text-white text-[11px] font-black">HA</div>
            </div>
          </div>
          <div className="flex flex-col relative z-10 -translate-y-0.5">
            <span
              className="text-3xl font-bold text-[#35104C] leading-none"
              style={{ fontFamily: '"Satisfy", cursive' }}
            >
              hastudio
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide py-2 relative">
        {/* Sliding Active Indicator */}
        {activeIndex !== -1 && (
          <div 
            className="absolute left-4 right-4 bg-blue-600 rounded-2xl transition-all duration-300 ease-out z-0 h-[52px] shadow-lg shadow-blue-500/20"
            style={{ 
              top: `${8 + activeIndex * (52 + 8)}px`, // 8px padding + index * (height + gap)
            }}
          />
        )}

        <div className="space-y-2 relative z-10">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-5 h-[52px] rounded-2xl transition-colors duration-300 leading-none ${isActive
                  ? "text-white"
                  : "text-slate-600 active:bg-slate-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-4">
                    <span className={``}>
                      {item.icon}
                    </span>
                    <span className="text-[17px] font-medium tracking-tight">{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* LOGOUT SECTION */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-4 px-5 h-[52px] w-full rounded-2xl text-red-500 hover:bg-red-50 transition-colors duration-200 font-semibold"
        >
          <LogOut size={22} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
