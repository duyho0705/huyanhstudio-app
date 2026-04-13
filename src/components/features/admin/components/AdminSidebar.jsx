import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  Layers,
  Users,
  MonitorPlay,
  MessageCircle,
  Music2,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut
} from "lucide-react";
import logoImg from "../../../../assets/logo.png";
import { useContext } from "react";
import { AuthContext } from "../../../../api/AuthContext";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);

  const menuItems = [
    {
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      label: "Bảng điều khiển",
      end: true,
    },
    {
      path: "/admin/chat",
      icon: <MessageCircle size={20} />,
      label: "Tin nhắn",
    },
    {
      path: "/admin/bookings",
      icon: <CalendarDays size={20} />,
      label: "Lịch thu âm",
    },
    {
      path: "/admin/products",
      icon: <Package size={20} />,
      label: "Kho sản phẩm",
    },
    {
      path: "/admin/services",
      icon: <Layers size={20} />,
      label: "Gói dịch vụ",
    },
    {
      path: "/admin/demos",
      icon: <Music2 size={20} />,
      label: "Quản lý Demo",
    },
    {
      path: "/admin/users",
      icon: <Users size={20} />,
      label: "Người dùng",
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-[1000] h-screen w-[280px] bg-white border-r border-slate-100 flex flex-col transition-all duration-500 transform lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl ring-1 ring-black/5" : "-translate-x-full"
        }`}
    >
      {/* LOGO SECTION */}
      <div className="p-8 pb-12">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-brand-orange rounded-md rotate-12 transition-transform shadow-lg shadow-brand-orange/20"></div>
                <div className="absolute inset-0 bg-[#6CD1FD] rounded-md -rotate-6 transition-transform shadow-lg shadow-[#6CD1FD]/20"></div>
                <div className="absolute inset-0 bg-[#35104C] rounded-md flex items-center justify-center text-white text-[11px] font-black shadow-xl shadow-black/20">HA</div>
            </div>
          </div>
          <div className="flex flex-col relative z-10 -translate-y-0.5">
            <span 
              className="text-3xl font-bold text-[#35104C] leading-none hover:text-[#6CD1FD] transition-colors" 
              style={{ fontFamily: '"Satisfy", cursive' }}
            >
              hastudio
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide py-2">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group leading-none ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-4">
                  <span className={``}>
                    {item.icon}
                  </span>
                  <span className="text-[15px] font-semibold tracking-tight">{item.label}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"></div>
                )}
              </>
            )}
          </NavLink>

        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
