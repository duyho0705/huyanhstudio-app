import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../../api/AuthContext";
import bookingApi from "../../../api/bookingApi";
import TokenService from "../../../api/tokenService";
import {
  Calendar,
  User,
  Tag as TagIcon,
  MessageSquare,
  Phone,
  Mail,
  Home,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Modal, Descriptions, Tag as AntTag, Button } from "antd";

const AdminBookings = () => {
  const { user } = useContext(AuthContext);
  const abortControllerRef = useRef(null);

  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchData = async (pageNum) => {
    setIsFetching(true);
    try {
      const res = await bookingApi.getBookingCustomer(pageNum, 5);
      const responseData = res.data?.data || res.data || res;
      const bookingsList = responseData.list || responseData.content || [];
      const pages = responseData.totalPages || 1;

      setBookings(Array.isArray(bookingsList) ? bookingsList : []);
      setTotalPages(pages);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setIsFetching(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setTotalPages(1);
      return;
    }

    const token = TokenService.get();
    if (!token) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    fetchData(page);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page, user]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "CONFIRMED": return "bg-blue-50 text-blue-600 border-blue-100";
      case "PENDING": return "bg-orange-50 text-orange-600 border-orange-100";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-100";
      case "COMPLETED": return "bg-green-50 text-green-600 border-green-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "CONFIRMED": return "Đã xác nhận";
      case "PENDING": return "Chờ xác nhận";
      case "CANCELLED": return "Đã hủy";
      case "COMPLETED": return "Hoàn thành";
      default: return "Không rõ";
    }
  };

  const shortCode = (code) => code?.slice(-6);

  const BookingSkeleton = () => (
    <div className="animate-pulse p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-100 rounded"></div>
          <div className="h-3 w-24 bg-slate-100 rounded"></div>
        </div>
      </div>
      <div className="h-8 w-24 bg-slate-50 rounded-full"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {isFetching ? (
        <div className="space-y-4">
          <BookingSkeleton />
          <BookingSkeleton />
          <BookingSkeleton />
          <BookingSkeleton />
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
          <Calendar size={64} className="opacity-10 mb-4" />
          <p className="font-bold text-lg">Chưa có đặt lịch nào</p>
          <p className="text-sm">Vui lòng quay lại sau</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="group p-5 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/5 relative overflow-hidden"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                      #{shortCode(booking.bookingCode)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{booking.customerName}</h4>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
                        <Calendar size={12} />
                        <span>{formatDate(booking.recordDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4 hidden md:flex">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Dịch vụ</span>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{booking.services.join(", ")}</span>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-all translate-x-0 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                icon={<ChevronLeft size={16} />}
                onClick={() => handlePageChange(Math.max(0, page - 1))}
                disabled={page === 0}
                className="h-10 w-10 flex items-center justify-center rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600"
              />
              <div className="px-6 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-sm font-black text-slate-600">
                {page + 1} / {totalPages}
              </div>
              <Button
                icon={<ChevronRight size={16} />}
                onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="h-10 w-10 flex items-center justify-center rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600"
              />
            </div>
          )}
        </div>
      )}

      <Modal
        title={<span className="text-xl font-black text-slate-900 uppercase">Chi tiết đặt lịch</span>}
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking(null)}
        footer={null}
        width={700}
        centered
        className="custom-admin-modal"
      >
        {selectedBooking && (
          <div className="py-6 space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                        <TagIcon size={32} className="text-blue-500" />
                    </div>
                    <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Mã đặt lịch</div>
                        <div className="text-2xl font-black text-blue-600">#{shortCode(selectedBooking.bookingCode)}</div>
                    </div>
                </div>
                <div className={`px-6 py-2 rounded-2xl border font-black text-xs uppercase tracking-[0.2em] ${getStatusStyles(selectedBooking.status)}`}>
                    {getStatusText(selectedBooking.status)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <User size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900">{selectedBooking.customerName}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Phone size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Số điện thoại</span>
                        </div>
                        <div className="font-bold text-slate-700">{selectedBooking.customerPhone || selectedBooking.phone || "N/A"}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Mail size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Email</span>
                        </div>
                        <div className="font-bold text-slate-700 break-all">{selectedBooking.customerEmail || selectedBooking.email || "N/A"}</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ngày thu</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900">{formatDate(selectedBooking.recordDate)}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Home size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Phòng Studio</span>
                        </div>
                        <div className="font-bold text-slate-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">{selectedBooking.studioRoom || "Mặc định"}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Dịch vụ</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedBooking.services.map((s, i) => (
                                <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedBooking.note && (
                <div className="p-6 rounded-3xl bg-blue-50/30 border border-blue-50 border-dashed">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare size={16} className="text-blue-500" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ghi chú</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{selectedBooking.note}"</p>
                </div>
            )}
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button 
                    onClick={() => setSelectedBooking(null)}
                    className="h-12 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-slate-800 transition-all border-none"
                >
                    Đóng
                </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBookings;
