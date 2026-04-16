import { useEffect, useState } from "react";
import { User, Calendar, Clock, ChevronRight, History, MoreHorizontal } from "lucide-react";
import bookingApi from "../../../../api/bookingApi";
import { Link } from "react-router-dom";

const getStatusBadge = (status) => {
  const styles = {
    PENDING: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", label: "Chờ xác nhận" },
    CONFIRMED: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", label: "Đã xác nhận" },
    COMPLETED: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100", label: "Hoàn tất" },
    CANCELLED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", label: "Đã hủy" },
  };
  const normalizedStatus = status?.toUpperCase();
  const style = styles[normalizedStatus] || styles.PENDING;

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[12px] font-medium border ${style.bg} ${style.text} ${style.border}`}>
      {style.label}
    </span>
  );
};

const AdminRecentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const response = await bookingApi.admin.getAll({
        pageNumber: 0,
        pageSize: 4,
        sortBy: "createdAt",
        sortDir: "desc",
      });

      if (response && response.data) {
        const bookingList = response.data.content || response.data.data || [];
        setBookings(bookingList);
      }
    } catch (error) {
      console.error("Failed to fetch recent bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-6 space-y-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse"></div>)}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <History size={20} />
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-slate-900 leading-tight">Giao dịch gần đây</h3>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">Thời gian thực các yêu cầu đặt lịch</p>
          </div>
        </div>
        <Link to="/admin/bookings" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[13px] font-medium text-slate-700 rounded-lg transition-all group">
          Tất cả <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </Link>
      </div>

      <div className="space-y-3">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="flex flex-col xl:flex-row xl:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300 gap-4 sm:gap-6 group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <img
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-slate-50 shadow-sm"
                    src={
                      booking.user?.avatar ||
                      `https://ui-avatars.com/api/?name=${booking.user?.fullName || "User"
                      }&background=f8fafc&color=334155`
                    }
                    alt={booking.user?.fullName}
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-slate-900 text-[13px] sm:text-[14px] leading-tight group-hover:text-blue-600 transition-colors">{booking.user?.fullName || "Khách vãng lai"}</h4>
                  <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-0.5">{booking.service?.name || "Dịch vụ thường"}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center xl:w-[500px] justify-between gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                <div className="flex flex-row sm:flex-col justify-between sm:justify-start gap-1 sm:w-[180px]">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <Calendar size={16} className="text-slate-400" />
                    <span>{booking.bookingDate || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] font-medium text-slate-500">
                    <Clock size={14} className="text-slate-400 sm:w-4 sm:h-4" />
                    <span>
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1.5 min-w-[120px] bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
                  <span className="text-[15px] font-semibold text-slate-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(booking.totalPrice || 0)}
                  </span>
                  {getStatusBadge(booking.status)}
                </div>

                <Link to="/admin/bookings" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 hidden xl:flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all">
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <Calendar size={24} strokeWidth={1.5} className="text-slate-300" />
            </div>
            <p className="text-[13px] font-medium">Hiện chưa có bản ghi đặt lịch mới</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecentBookings;
