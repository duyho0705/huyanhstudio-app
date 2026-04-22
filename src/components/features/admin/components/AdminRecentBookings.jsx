import { useEffect, useState } from "react";
import { User, Calendar, Clock, ChevronRight, History, Hash } from "lucide-react";
import bookingApi from "../../../../api/bookingApi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { removeVietnameseTones } from "../../../../utils/removeVietnameseTones";

const getStatusBadge = (status, t) => {
  const styles = {
    PENDING: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", label: t('user.booking.statuses.PENDING') },
    CONFIRMED: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", label: t('user.booking.statuses.CONFIRMED') },
    COMPLETED: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100", label: t('user.booking.statuses.COMPLETED') },
    CANCELLED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", label: t('user.booking.statuses.CANCELLED') },
  };
  const normalizedStatus = status?.toUpperCase();
  const style = styles[normalizedStatus] || styles.PENDING;

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[13px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
      {style.label}
    </span>
  );
};

const AdminRecentBookings = () => {
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentBookings = async () => {
    try {
      const res = await bookingApi.getBookingCustomer(0, 5); // Lấy 5 đơn mới nhất
      const apiRes = res?.data || res;
      const mainData = apiRes.data !== undefined ? apiRes.data : apiRes;
      const list = Array.isArray(mainData) ? mainData : (mainData?.content || mainData?.list || []);

      setBookings(list);
    } catch (error) {
      console.error("Failed to fetch recent bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  if (loading) return (
    <div className="p-6 space-y-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse"></div>)}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
            <History size={20} />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-slate-900 leading-tight">{t('admin.dashboard.recent_title')}</h3>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">{t('admin.dashboard.recent_desc')}</p>
          </div>
        </div>
        <Link to="/admin/bookings" className="text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
          {t('admin.dashboard.view_all')}
        </Link>
      </div>

      <div className="space-y-3">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 transition-all group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
                  <User size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-bold text-slate-900 text-[14px] leading-tight group-hover:text-blue-600 transition-colors truncate">
                    {i18n.language === 'en' ? removeVietnameseTones(booking.customerName) : booking.customerName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 flex items-center gap-1">
                      <Hash size={10} /> {booking.bookingCode?.slice(-6)}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                    <p className="text-[12px] font-medium truncate max-w-[200px]">
                      {Array.isArray(booking.services) ? booking.services.join(", ") : t('admin.dashboard.standard_service')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{dayjs(booking.recordDate).format("DD/MM/YYYY")}</span>
                  </div>
                  <span className="text-[12px] font-medium text-slate-400 mt-0.5 whitespace-nowrap">{t('admin.dashboard.expected_date')}</span>
                </div>

                <div className="shrink-0">
                  {getStatusBadge(booking.status, t)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
            <Calendar size={48} strokeWidth={1} className="text-slate-200 mb-4" />
            <p className="text-[14px] font-bold text-slate-300">{t('admin.dashboard.no_records')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecentBookings;
