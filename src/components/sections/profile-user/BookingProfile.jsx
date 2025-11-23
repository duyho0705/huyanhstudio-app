import "../../../styles/BookingProfile.scss";
import { useState, useEffect, useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AuthContext } from "../../../api/AuthContext";
import bookingApi from "../../../api/bookingApi";
import Modal from "../../sections/Modal";
const BookingProfile = () => {
  const { user, loading } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (loading || !user) return;

    const fetchData = async () => {
      try {
        const res = await bookingApi.getBookingCustomer(0, 10);
        setBookings(res.data.list);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchData();
  }, [loading, user]);

  const getStatus = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="status status--confirmed">Đã xác nhận</span>;
      case "PENDING":
        return <span className="status status--pending">Chờ xác nhận</span>;
      case "CANCELLED":
        return <span className="status status--cancelled">Đã hủy</span>;
      default:
        return <span className="status">Không rõ</span>;
    }
  };

  if (loading) return <p className="loading">Đang tải...</p>;

  return (
    <div className="booking-profile">
      <h2 className="booking-profile__title">Thông tin đặt lịch</h2>

      <div className="booking-profile__table">
        <table>
          <thead>
            <tr>
              <th>Mã lịch</th>
              <th>Tên khách hàng</th>
              <th>Ngày thu</th>
              <th>Dịch vụ</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.bookingId}>
                <td>{b.bookingId}</td>
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
      </div>

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Chi tiết đặt lịch"
        content={
          selectedBooking && (
            <div className="modal-detail">
              <p>
                <strong>Mã lịch:</strong> {selectedBooking.bookingId}
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
