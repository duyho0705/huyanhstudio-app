import { useTranslation } from "react-i18next";
import useAuthStore from "../../../stores/useAuthStore";
import useAppStore from "../../../stores/useAppStore";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Package,
  Mic2,
  Headphones,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  CalendarPlus,
  Headset,
  ShoppingBag,
  UserPlus,
  Music2,
  ArrowUpRight,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import statsApi from "../../../api/statsApi";
import AdminRevenueChart from "./components/AdminRevenueChart";
import AdminRecentBookings from "./components/AdminRecentBookings";
import AdminPopularServices from "./components/AdminPopularServices";
import { removeVietnameseTones } from "../../../utils/removeVietnameseTones";

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const user = useAuthStore(state => state.user);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsApi.getSummary();
      const data = response.data?.data || response.data;

      setStats({
        totalBookings: data.totalBookings || 0,
        pendingBookings: data.pendingBookings || 0,
        confirmedBookings: data.confirmedBookings || 0,
        completedBookings: data.completedBookings || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('admin.dashboard.morning');
    if (hour < 18) return t('admin.dashboard.afternoon');
    return t('admin.dashboard.evening');
  };

  const cards = [
    {
      title: t('admin.dashboard.total'),
      value: stats.totalBookings,
      icon: <BarChart3 size={20} />,
      iconBg: "bg-[#35104C]/10 text-[#35104C]",
      link: "/admin/bookings",
    },
    {
      title: t('admin.dashboard.pending'),
      value: stats.pendingBookings,
      icon: <Clock size={20} />,
      iconBg: "bg-amber-100 text-amber-600",
      link: "/admin/bookings?status=PENDING",
    },
    {
      title: t('admin.dashboard.confirmed'),
      value: stats.confirmedBookings,
      icon: <Calendar size={20} />,
      iconBg: "bg-violet-100 text-violet-600",
      link: "/admin/bookings?status=CONFIRMED",
    },
    {
      title: t('admin.dashboard.completed'),
      value: stats.completedBookings,
      icon: <CheckCircle2 size={20} />,
      iconBg: "bg-emerald-100 text-emerald-600",
      link: "/admin/bookings?status=COMPLETED",
    },
  ];

  const quickLinks = [
    { title: t('admin.dashboard.quick_booking'), icon: <CalendarPlus size={18} />, link: "/admin/bookings", color: "text-[#35104C]" },
    { title: t('admin.dashboard.quick_service'), icon: <Headset size={18} />, link: "/admin/services", color: "text-violet-600" },
    { title: t('admin.dashboard.quick_product'), icon: <ShoppingBag size={18} />, link: "/admin/products", color: "text-emerald-600" },
    { title: t('admin.dashboard.quick_user'), icon: <UserPlus size={18} />, link: "/admin/users", color: "text-amber-600" },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Welcome header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-32 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-slate-200 rounded-xl flex-shrink-0"></div>
            ))}
          </div>
        </div>

        {/* Stats Cards skeleton */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 sm:p-6 rounded-[24px] bg-white border border-slate-100 h-32 sm:h-40">
              <div className="flex justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100"></div>
                <div className="w-4 h-4 bg-slate-50 rounded hidden sm:block"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-24 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 h-[350px] sm:h-[450px]">
            <div className="h-6 w-40 bg-slate-100 rounded-lg mb-8"></div>
            <div className="w-full h-full bg-slate-50 rounded-2xl"></div>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 h-[350px] sm:h-[450px]">
            <div className="h-6 w-40 bg-slate-100 rounded-lg mb-8"></div>
            <div className="w-full h-full bg-slate-50 rounded-2xl"></div>
          </div>
        </div>

        {/* Recent Bookings skeleton */}
        <div className="bg-white rounded-[32px] border border-slate-100 h-80">
          <div className="p-6 border-b border-slate-50">
            <div className="h-6 w-48 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="p-6 space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-12 w-full bg-slate-50 rounded-xl"></div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[19px] font-medium text-slate-700 tracking-tight mb-1">
            {getGreeting()}, <span className="font-medium text-black">
              {i18n.language === 'en' ? removeVietnameseTones(user?.customerName) : user?.customerName}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          {quickLinks.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="h-10 sm:h-9 px-3.5 flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white text-[13px] sm:text-sm font-bold sm:font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm sm:shadow-none"
            >
              <span className={item.color}>{item.icon}</span>
              <span className="inline lg:inline whitespace-nowrap">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="p-4 sm:p-6 rounded-2xl sm:rounded-[24px] bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${card.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                {card.icon}
              </div>
              <ArrowUpRight size={16} strokeWidth={2.5} className="text-slate-300 sm:block hidden group-hover:text-slate-900 transition-colors" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">{card.value}</p>
            <p className="text-sm sm:text-base font-semibold text-slate-500 mt-0.5">{card.title}</p>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
          <AdminRevenueChart />
        </div>
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
          <AdminPopularServices />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl sm:rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
        <AdminRecentBookings />
      </div>
    </div>
  );
};

export default AdminDashboard;
