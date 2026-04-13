import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  Layers,
  Users,
  MonitorPlay,
  ArrowRightCircle,
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
      path: "/admin/users",
      icon: <Users size={20} />,
      label: "Khách hàng",
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-[1000] h-screen w-[280px] bg-slate-950 border-r border-slate-900 flex flex-col transition-all duration-500 transform lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl ring-1 ring-white/10" : "-translate-x-full"
        }`}
    >
      {/* LOGO SECTION */}
      <div className="p-8 pb-12">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img src={logoImg} alt="Logo" className="w-11 h-11 object-contain relative z-10 brightness-110" />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-xl font-semibold text-white tracking-widest italic">Huy Anh</span>
            <span className="text-[10px] font-semibold text-blue-500 tracking-[0.3em] -mt-1">Studio Admin</span>
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
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-500 hover:bg-white/5 hover:text-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-4">
                  <span className={`transition-transform duration-500 group-hover:scale-110`}>
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
