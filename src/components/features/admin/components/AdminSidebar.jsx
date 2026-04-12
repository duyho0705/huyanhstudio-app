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
      label: "Lịch đặt phòng",
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
      icon: <MonitorPlay size={20} />,
      label: "Thư viện Demo",
    },
    {
      path: "/admin/users",
      icon: <Users size={20} />,
      label: "Khách hàng",
    },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 z-[1000] h-screen w-[280px] bg-slate-950 border-r border-slate-900 flex flex-col transition-all duration-500 transform lg:translate-x-0 ${
        isOpen ? "translate-x-0 shadow-2xl ring-1 ring-white/10" : "-translate-x-full"
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
                <span className="text-xl font-black text-white tracking-widest uppercase italic">HUY ANH</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] -mt-1">STUDIO ADMIN</span>
            </div>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide py-2">
        <div className="px-4 mb-4">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Danh mục chính</span>
        </div>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group leading-none ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-100"
              }`
            }
          >
            <div className="flex items-center gap-4">
                <span className={`transition-transform duration-500 group-hover:scale-110`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-black tracking-tight uppercase">{item.label}</span>
            </div>
            {({ isActive }) => isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"></div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER SECTION */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <ShieldCheck size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Account Role</span>
                    <span className="text-xs font-bold text-white uppercase tracking-tight">Super Control</span>
                </div>
             </div>
             
             <button 
                onClick={logout}
                className="w-full h-12 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:border-red-500/20"
             >
                <LogOut size={14} />
                Đăng xuất hệ thống
             </button>
        </div>
        
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em] text-center mt-6">
            Cloud Infrastructure © 2024
        </p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
