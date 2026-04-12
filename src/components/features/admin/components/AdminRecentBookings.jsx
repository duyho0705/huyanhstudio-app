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
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${style.bg} ${style.text} ${style.border}`}>
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
     <div className="p-8 space-y-6">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse"></div>)}
     </div>
  );

  return (
    <div className="p-2 md:p-4">
      <div className="flex items-center justify-between mb-10 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <History size={24} />
          </div>
          <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Giao dịch gần đây</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Thời gian thực các yêu cầu đặt lịch</p>
          </div>
        </div>
        <Link to="/admin/bookings" className="h-12 px-6 flex items-center gap-3 bg-slate-50 hover:bg-slate-900 text-slate-600 hover:text-white rounded-2xl transition-all duration-300 group font-black uppercase text-[10px] tracking-widest">
          Toàn bộ lịch sử <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="flex flex-col xl:flex-row xl:items-center justify-between p-6 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 gap-6 group">
              <div className="flex items-center gap-6">
                <div className="relative">
                    <img
                      className="w-16 h-16 rounded-[1.5rem] object-cover ring-4 ring-white shadow-xl transition-transform group-hover:scale-95 duration-500"
                      src={
                        booking.user?.avatar ||
                        `https://ui-avatars.com/api/?name=${
                          booking.user?.fullName || "User"
                        }&background=0f172a&color=fff&bold=true`
                      }
                      alt={booking.user?.fullName}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Customer Record</span>
                  <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight group-hover:text-blue-600 transition-colors">{booking.user?.fullName || "Khách vãng lai"}</h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">{booking.service?.name || "Dịch vụ thường"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{booking.bookingDate || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={14} className="text-slate-400" />
                    <span>
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2.5 min-w-[140px]">
                  <span className="text-lg font-black text-slate-900 tracking-tight">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(booking.totalPrice || 0)}
                  </span>
                  {getStatusBadge(booking.status)}
                </div>
                
                <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 rounded-[2rem] bg-white shadow-sm flex items-center justify-center mb-6">
                <Calendar size={32} strokeWidth={1} className="opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Hiện chưa có bản ghi đặt lịch mới</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecentBookings;
