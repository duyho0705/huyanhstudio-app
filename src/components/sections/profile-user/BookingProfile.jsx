import "../../../styles/BookingProfile.scss";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
const BookingProfile = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookings = [
    {
      id: "DL001",
      date: "2025-01-05",
      time: "14:00",
      service: "Cắt tóc nam",
      status: "confirmed",
    },
    {
      id: "DL002",
      date: "2025-01-10",
      time: "09:00",
      service: "Gội đầu thư giãn",
      status: "pending",
    },
    {
      id: "DL003",
      date: "2025-01-20",
      time: "16:30",
      service: "Nhuộm tóc",
      status: "cancelled",
    },
  ];

  const getStatus = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="status status--confirmed">Đã xác nhận</span>;
      case "pending":
        return <span className="status status--pending">Chờ xác nhận</span>;
      case "cancelled":
        return <span className="status status--cancelled">Đã hủy</span>;
      default:
        return <span className="status">Không rõ</span>;
    }
  };

  return (
    <div className="booking-profile">
      <h2 className="booking-profile__title">Thông tin đặt lịch</h2>

      <div className="booking-profile__table">
        <table>
          <thead>
            <tr>
              <th>Mã lịch</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Dịch vụ</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.service}</td>
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

      {/* ================= MODAL ================= */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết đặt lịch</h3>
            <p><strong>Mã lịch:</strong> {selectedBooking.id}</p>
            <p><strong>Ngày:</strong> {selectedBooking.date}</p>
            <p><strong>Giờ:</strong> {selectedBooking.time}</p>
            <p><strong>Dịch vụ:</strong> {selectedBooking.service}</p>
            <p><strong>Trạng thái:</strong> {getStatus(selectedBooking.status)}</p>

            <button className="modal__close" onClick={() => setSelectedBooking(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default BookingProfile;
