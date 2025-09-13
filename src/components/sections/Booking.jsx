import { FaCheck } from "react-icons/fa";
import "../../styles/Booking.scss";
import { DatePicker, Select, Input } from "antd";


const { Option } = Select;
const { TextArea } = Input;

const Booking = () => {
  return (
    <div className="booking container" id="booking">
      <div className="row">
        {/* LEFT */}
        <div className="col-xl-6">
          <div className="booking__left">
            <h3 className="booking__left-title">Đặt lịch thu âm</h3>
            <p className="booking__left-desc">
              Chọn khung giờ phù hợp, chúng tôi sẽ xác nhận trong ngày. <br />
              Lưu ý: vui lòng để lại email/số điện thoại chính xác.
            </p>

            <p>
              <FaCheck className="booking__tick" />
              Miễn phí tư vấn trước buổi thu
            </p>
            <p>
              <FaCheck className="booking__tick" />
              Hỗ trợ viết lời, định hướng phong cách
            </p>
            <p>
              <FaCheck className="booking__tick" />
              Bàn giao file nhanh, rõ ràng, đúng hẹn
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-xl-6">
          <div className="booking__right">
            <div className="booking__card">
              <h2 className="booking__card-title">Form đặt lịch</h2>
              <p className="booking__card-desc">
                Điền thông tin, chúng tôi sẽ liên hệ lại.
              </p>

              <form className="booking__form">
                {/* Họ tên */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="fullName">Họ tên</label>
                  <Input
                    id="fullName"
                    placeholder="Hồ Văn Duy"
                    size="large"
                    spellCheck={false}
                    rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                  />
                </div>

                {/* SĐT */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="phoneNumber">Số điện thoại</label>
                  <Input
                    id="phoneNumber"
                    placeholder="0123456789"
                    size="large"
                    spellCheck={false}
                    required
                  />
                </div>

                {/* Ngày thu */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="dateToWork">Ngày thu</label>
                  <DatePicker
                    id="dateToWork"
                    placeholder="Chọn ngày thu"
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                  />
                </div>

                {/* Dịch vụ */}
                <div className="booking__field">
                  <label className="booking__label">Dịch vụ</label>
                  <Select
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Chọn dịch vụ"
                  >
                    <Option value="recording">Recording</Option>
                    <Option value="mixing">Mixing Master</Option>
                    <Option value="beat">Phối beat</Option>
                  </Select>
                </div>

                {/* Ghi chú */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="note">Ghi chú</label>
                  <TextArea
                    id="note"
                    className="booking__note"
                    placeholder="Yêu cầu thêm... (nhạc cụ, số người, thời lượng...)"
                    size="large"
                    spellCheck={false}
                  />
                </div>

                {/* Button actions */}
                <div className="booking__actions">
                  <button type="reset" className="booking__btn booking__btn--delete">
                    Xóa
                  </button>
                  <button type="submit" className="booking__btn booking__btn--request">
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
