import { useEffect, useState } from "react";
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
} from "lucide-react";
import statsApi from "../../../api/statsApi";
import AdminRevenueChart from "./components/AdminRevenueChart";
import AdminRecentBookings from "./components/AdminRecentBookings";
import AdminPopularServices from "./components/AdminPopularServices";

const AdminDashboard = () => {
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

  const cards = [
    {
      title: "Tổng đặt lịch",
      value: stats.totalBookings,
      icon: <BarChart3 size={32} />,
      color: "blue",
      link: "/admin/bookings",
    },
    {
      title: "Chờ xác nhận",
      value: stats.pendingBookings,
      icon: <Clock size={32} />,
      color: "orange",
      link: "/admin/bookings?status=PENDING",
    },
    {
      title: "Đã xác nhận",
      value: stats.confirmedBookings,
      icon: <Calendar size={32} />,
      color: "purple",
      link: "/admin/bookings?status=CONFIRMED",
    },
    {
      title: "Hoàn thành",
      value: stats.completedBookings,
      icon: <CheckCircle2 size={32} />,
      color: "green",
      link: "/admin/bookings?status=COMPLETED",
    },
  ];

  const quickActions = [
    {
      title: "Đặt lịch mới",
      icon: <CalendarPlus size={26} />,
      link: "/admin/bookings?action=create",
      color: "blue",
    },
    {
      title: "Quản lý dịch vụ",
      icon: <Headset size={26} />,
      link: "/admin/services",
      color: "purple",
    },
    {
      title: "Quản lý sản phẩm",
      icon: <ShoppingBag size={26} />,
      link: "/admin/products",
      color: "green",
    },

    {
      title: "Quản lý người dùng",
      icon: <UserPlus size={26} />,
      link: "/admin/users",
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium tracking-normal">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const getColorClasses = (color) => {
    const maps = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      orange: "bg-orange-50 text-orange-600 border-orange-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
      green: "bg-green-50 text-green-600 border-green-100",
    };
    return maps[color] || maps.blue;
  };

  const getIconBg = (color) => {
    const maps = {
      blue: "bg-blue-500/10 text-blue-600",
      orange: "bg-orange-500/10 text-orange-600",
      purple: "bg-purple-500/10 text-purple-600",
      green: "bg-green-500/10 text-green-600",
    };
    return maps[color] || maps.blue;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`p-4 rounded-2xl border border-slate-200 transition-all hover:border-slate-300 hover:shadow-sm group bg-white`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg transition-transform ${getColorClasses(card.color)}`}>
                {card.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-slate-500 group-hover:text-slate-600 transition-colors">{card.title}</span>
                <span className="text-2xl font-semibold text-slate-900 leading-tight">{card.value}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="bg-white p-5 md:p-6 rounded-[28px] border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Decorative Backgrounds */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/40 rounded-full blur-[80px] -z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-50/40 rounded-full blur-[80px] -z-0"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Thao tác nhanh</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-100 bg-white/50 backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group hover:-translate-y-1 hover:border-blue-100`}
              >
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all group-hover:scale-110 shadow-sm ${getColorClasses(action.color)}`}>
                  {action.icon}
                </div>
                <span className="text-[14px] font-semibold text-slate-700 group-hover:text-blue-600 transition-colors text-center tracking-normal">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics & Popular Services Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
          <AdminRevenueChart />
        </div>
        <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
          <AdminPopularServices />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
        <AdminRecentBookings />
      </div>
    </div>
  );
};

export default AdminDashboard;
