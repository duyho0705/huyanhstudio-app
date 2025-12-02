import "../../../styles/BookingProfile.scss";
import { useState, useEffect, useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
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
      const res = await bookingApi.getBookingCustomer(pageNum, 10);
      setBookings(res.data.list);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    fetchData(page);
  }, [loading, user, page]);

  const getStatus = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="status status--confirmed">Đã xác nhận</span>;
      case "PENDING":
        return <span className="status status--pending">Chờ xác nhận</span>;
      case "CANCELLED":
        return <span className="status status--cancelled">Đã hủy</span>;
      case "COMPLETED":
        return <span className="status status--completed">Đã hoàn thành</span>;
      default:
        return <span className="status">Không rõ</span>;
    }
  };

  const shortCode = (code) => code?.slice(-6);

  if (loading) return <p className="loading">Đang tải...</p>;

  return (
    <div className="booking-profile">
      <div className="booking-profile__table">
        <table>
          <thead>
            <tr>
              <th>Mã lịch</th>
              <th>Khách hàng</th>
              <th>Ngày thu</th>
              <th>Dịch vụ</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.bookingCode}>
                <td>{shortCode(b.bookingCode)}</td>
                <td>{b.customerName}</td>
                <td>{b.recordDate}</td>
                <td>{b.services.join(", ")}</td>
                <td>{getStatus(b.status)}</td>
                <td>
                  <button
                    className="dots-btn"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <BsThreeDotsVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination__btn"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Trước
            </button>
            <span className="pagination__info">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              className="pagination__btn"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Chi tiết đặt lịch"
        content={
          selectedBooking && (
            <div className="modal-detail" key={selectedBooking.bookingCode}>
              <p>
                <strong>Mã lịch:</strong>{" "}
                {shortCode(selectedBooking.bookingCode)}
              </p>
              <p>
                <strong>Khách hàng:</strong> {selectedBooking.customerName}
              </p>
              <p>
                <strong>Ngày thu:</strong> {selectedBooking.recordDate}
              </p>
              <p>
                <strong>Dịch vụ:</strong> {selectedBooking.services.join(", ")}
              </p>
              <p>
                <strong>Ghi chú:</strong>{" "}
                {selectedBooking.note || "Không có ghi chú"}
              </p>
              <p>
                <strong>Phòng:</strong> {selectedBooking.studioRoom}
              </p>
              <p>
                <strong>Trạng thái:</strong> {getStatus(selectedBooking.status)}
              </p>
            </div>
          )
        }
      />
    </div>
  );
};

export default BookingProfile;
