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
import { AuthContext } from "../../../api/AuthContext";
import statsApi from "../../../api/statsApi";
import AdminRevenueChart from "./components/AdminRevenueChart";
import AdminRecentBookings from "./components/AdminRecentBookings";
import AdminPopularServices from "./components/AdminPopularServices";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
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
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const cards = [
    {
      title: "Tổng đặt lịch",
      value: stats.totalBookings,
      icon: <BarChart3 size={20} />,
      iconBg: "bg-blue-100 text-blue-600",
      link: "/admin/bookings",
    },
    {
      title: "Chờ xác nhận",
      value: stats.pendingBookings,
      icon: <Clock size={20} />,
      iconBg: "bg-amber-100 text-amber-600",
      link: "/admin/bookings?status=PENDING",
    },
    {
      title: "Đã xác nhận",
      value: stats.confirmedBookings,
      icon: <Calendar size={20} />,
      iconBg: "bg-violet-100 text-violet-600",
      link: "/admin/bookings?status=CONFIRMED",
    },
    {
      title: "Hoàn thành",
      value: stats.completedBookings,
      icon: <CheckCircle2 size={20} />,
      iconBg: "bg-emerald-100 text-emerald-600",
      link: "/admin/bookings?status=COMPLETED",
    },
  ];

  const quickLinks = [
    { title: "Đặt lịch", icon: <CalendarPlus size={18} />, link: "/admin/bookings", color: "text-blue-600" },
    { title: "Dịch vụ", icon: <Headset size={18} />, link: "/admin/services", color: "text-violet-600" },
    { title: "Sản phẩm", icon: <ShoppingBag size={18} />, link: "/admin/products", color: "text-emerald-600" },
    { title: "Người dùng", icon: <UserPlus size={18} />, link: "/admin/users", color: "text-amber-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400 font-medium mb-1">{getGreeting()}</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {user?.fullName || "Admin"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {quickLinks.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="h-9 px-3.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all"
            >
              <span className={item.color}>{item.icon}</span>
              <span className="hidden lg:inline">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="group p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                {card.icon}
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{card.title}</p>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <AdminRevenueChart />
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <AdminPopularServices />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-slate-200">
        <AdminRecentBookings />
      </div>
    </div>
  );
};

export default AdminDashboard;
