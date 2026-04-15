import { useState, useEffect, useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuCalendar } from "react-icons/lu";
import { AuthContext } from "../../../api/AuthContext";
import bookingApi from "../../../api/bookingApi";
import Modal from "../../layout/Modal";

const BookingProfile = () => {
  const { user, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (pageNum) => {
    try {
      const res = await bookingApi.getBookingCustomer(pageNum, 10).catch(err => {
        console.error("Booking Profile API Error:", err);
        return { list: [], totalPages: 0 };
      });

      const getList = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.list && Array.isArray(data.list)) return data.list;
        if (data.content && Array.isArray(data.content)) return data.content;
        if (data.data) {
          if (Array.isArray(data.data)) return data.data;
          if (data.data.list && Array.isArray(data.data.list)) return data.data.list;
        }
        return [];
      };

      const list = getList(res);
      setBookings(list);
      setTotalPages(res.totalPages || (res.data?.totalPages) || 1);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    fetchData(page);
  }, [loading, user, page]);

  const statusMap = {
    CONFIRMED: { label: "Đã xác nhận", class: "bg-green-100 text-green-700" },
    PENDING: { label: "Chờ xác nhận", class: "bg-yellow-100 text-yellow-700" },
    CANCELLED: { label: "Đã hủy", class: "bg-red-100 text-red-700" },
    COMPLETED: { label: "Đã hoàn thành", class: "bg-blue-100 text-blue-700" },
  };

  const getStatus = (status) => {
    const s = statusMap[status] || { label: "Không rõ", class: "bg-gray-100 text-gray-600" };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.class}`}>{s.label}</span>;
  };

  const shortCode = (code) => code?.slice(-6);

  if (loading) return <p className="text-center text-gray-400 py-8">Đang tải...</p>;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Mã lịch</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Ngày thu</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Dịch vụ</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b.bookingCode} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{shortCode(b.bookingCode)}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{b.customerName}</td>
                  <td className="py-3 px-4 text-gray-600">{b.recordDate}</td>
                  <td className="py-3 px-4 text-gray-600">{b.services?.join(", ") || "N/A"}</td>
                  <td className="py-3 px-4">{getStatus(b.status)}</td>
                  <td className="py-3 px-4">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700" onClick={() => setSelectedBooking(b)}>
                      <BsThreeDotsVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                      <LuCalendar size={24} />
                    </div>
                    <p className="text-gray-400 font-medium">Bạn chưa từng đặt lịch thu âm</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-100">
            <button className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Trước</button>
            <span className="text-sm text-gray-500">Trang {page + 1} / {totalPages}</span>
            <button className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>Sau</button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Chi tiết đặt lịch"
        content={selectedBooking && (
          <div className="flex flex-col gap-3" key={selectedBooking.bookingCode}>
            {[
              ["Mã lịch", shortCode(selectedBooking.bookingCode)],
              ["Khách hàng", selectedBooking.customerName],
              ["Ngày thu", selectedBooking.recordDate],
              ["Dịch vụ", selectedBooking.services.join(", ")],
              ["Ghi chú", selectedBooking.note || "Không có ghi chú"],
              ["Phòng", selectedBooking.studioRoom],
            ].map(([label, val]) => (
              <p key={label} className="text-sm"><strong className="text-gray-800">{label}:</strong> <span className="text-gray-600">{val}</span></p>
            ))}
            <p className="text-sm"><strong className="text-gray-800">Trạng thái:</strong> {getStatus(selectedBooking.status)}</p>
          </div>
        )}
      />
    </div>
  );
};

export default BookingProfile;
