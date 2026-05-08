import useAuthStore from "../../../../stores/useAuthStore";
import useAppStore from "../../../../stores/useAppStore";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../../api/firebase";
import statsApi from "../../../../api/statsApi";
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

  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);

  useEffect(() => {
    // 1. Listen for unread chats in real-time
    const q = query(collection(db, "chat_list"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.filter(doc => doc.data().unread === true).length;
      setUnreadCount(count);
    });

    // 2. Fetch initial pending bookings count from DB
    const fetchPendingCount = async () => {
      try {
        const response = await statsApi.getSummary();
        const data = response.data?.data || response.data;
        setPendingBookings(data.pendingBookings || 0);
      } catch (error) {
        console.error("Error fetching summary stats:", error);
      }
    };
    fetchPendingCount();

    // 3. Listen for new bookings realtime events to increment count
    const handleNewBooking = () => {
      setPendingBookings(prev => prev + 1);
    };

    window.addEventListener("new-booking", handleNewBooking);

    return () => {
      unsubscribe();
      window.removeEventListener("new-booking", handleNewBooking);
    };
  }, []);

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
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: "bg-red-500 shadow-red-500/30",
    },
    {
      path: "/admin/bookings",
      icon: <CalendarDays size={22} />,
      label: t('admin.sidebar.bookings'),
      badge: pendingBookings > 0 ? pendingBookings : null,
      badgeColor: "bg-amber-500 shadow-amber-500/30",
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
            className="absolute left-3 right-3 bg-slate-900 rounded-xl transition-all duration-300 ease-out z-0 h-[48px] shadow-md shadow-slate-900/20"
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
                `flex items-center justify-between px-4 h-[48px] rounded-xl transition-all duration-300 leading-none group ${isActive
                  ? "text-white font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#35104C] active:bg-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#35104C]"}`}>
                      {item.icon}
                    </span>
                    <span className={`text-[15px] tracking-tight transition-colors duration-300 truncate ${isActive ? "text-white font-bold" : "text-slate-600 font-semibold"}`}>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className={`h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-extrabold text-white shadow-sm ring-1 ring-white/10 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
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
          <span>{t('admin.header.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
