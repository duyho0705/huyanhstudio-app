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
  PlusCircle,
  Music2,
} from "lucide-react";
import bookingApi from "../../../api/bookingApi";
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
      const [totalRes, pendingRes, confirmedRes, completedRes] =
        await Promise.all([
          bookingApi.admin.getAll({ pageNumber: 0, pageSize: 1 }),
          bookingApi.admin.getAll({
            pageNumber: 0,
            pageSize: 1,
            status: "PENDING",
          }),
          bookingApi.admin.getAll({
            pageNumber: 0,
            pageSize: 1,
            status: "CONFIRMED",
          }),
          bookingApi.admin.getAll({
            pageNumber: 0,
            pageSize: 1,
            status: "COMPLETED",
          }),
        ]);

      const getTotal = (res) =>
        res.data?.data?.totalElements || res.data?.totalElements || 0;

      setStats({
        totalBookings: getTotal(totalRes),
        pendingBookings: getTotal(pendingRes),
        confirmedBookings: getTotal(confirmedRes),
        completedBookings: getTotal(completedRes),
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
      icon: <PlusCircle size={24} />,
      link: "/admin/bookings?action=create",
      color: "blue",
    },
    {
      title: "Quản lý dịch vụ",
      icon: <Mic2 size={24} />,
      link: "/admin/services",
      color: "purple",
    },
    {
      title: "Quản lý sản phẩm",
      icon: <Package size={24} />,
      link: "/admin/products",
      color: "green",
    },

    {
      title: "Quản lý người dùng",
      icon: <Users size={24} />,
      link: "/admin/users",
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`p-6 rounded-2xl border transition-all hover:shadow-lg group ${getColorClasses(card.color)} bg-white`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl transition-transform group-hover:scale-110 ${getIconBg(card.color)}`}>
                {card.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-wider">{card.title}</span>
                <span className="text-3xl font-black text-slate-900">{card.value}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-900">Thao tác nhanh</h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border border-transparent transition-all hover:shadow-md group ${getColorClasses(action.color)}`}
            >
              <div className={`p-3 rounded-xl transition-all group-hover:bg-white group-hover:shadow-sm ${getIconBg(action.color)}`}>
                {action.icon}
              </div>
              <span className="text-sm font-bold">{action.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Analytics & Popular Services Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <AdminRevenueChart />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <AdminPopularServices />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <AdminRecentBookings />
      </div>
    </div>
  );
};

export default AdminDashboard;
