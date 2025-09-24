import "../../styles/Booking.scss";
import { DatePicker, Select, Input, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const Booking = ({ selectedService }) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(null);
  const [service, setService] = useState();

  // 👇 Đây là hook của Antd v5 để show message
  const [messageApi, contextHolder] = message.useMessage();

  const isFormValid = fullName && phone && date && service && email;

  useEffect(() => {
    if (selectedService) {
      setService(selectedService);
    }
  }, [selectedService]);

  const handleReset = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setNote("");
    setDate(null);
    setService(undefined);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log({
      fullName,
      phone,
      date: date ? dayjs(date).format("DD/MM/YYYY") : null,
      service,
      note,
    });

    // 🚀 Thông báo thành công
    messageApi.success("Yêu cầu của bạn đã được gửi thành công!");

    handleReset();
  };

  return (
    <div className="booking container" id="booking">
      {/* 👇 BẮT BUỘC phải render contextHolder thì mới thấy message */}
      {contextHolder}

      <div className="row">
        <div className="col-xl-6">
          <div className="booking__right">
            <div className="booking__card">
              <h2 className="booking__card-title">Đặt lịch thu âm</h2>
              <p className="booking__card-desc">
                Điền thông tin, chúng tôi sẽ liên hệ lại.
              </p>

              <form
                className="booking__form"
                onReset={handleReset}
                onSubmit={handleSubmit}
              >
                {/* Họ tên */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="fullName">
                    Họ tên
                  </label>
                  <Input
                    id="fullName"
                    placeholder="Hồ Văn Duy"
                    size="large"
                    spellCheck={false}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* SĐT */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="phoneNumber">
                    Số điện thoại
                  </label>
                  <Input
                    id="phoneNumber"
                    placeholder="0123456789"
                    size="large"
                    spellCheck={false}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Gmail */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="hovanduy123@gmail.com"
                    size="large"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Ngày thu */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="dateToWork">
                    Ngày thu
                  </label>
                  <DatePicker
                    id="dateToWork"
                    placeholder="Chọn ngày thu"
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    value={date}
                    onChange={(val) => setDate(val)}
                  />
                </div>

                {/* Dịch vụ */}
                <div className="booking__field">
                  <label className="booking__label">Dịch vụ</label>
                  <Select
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Chọn dịch vụ"
                    value={service}
                    onChange={(val) => setService(val)}
                  >
                    <Option value="recording">Recording</Option>
                    <Option value="mixing">Mixing Mastering</Option>
                    <Option value="beat">Phối Beat</Option>
                  </Select>
                </div>

                {/* Ghi chú */}
                <div className="booking__field">
                  <label className="booking__label" htmlFor="note">
                    Ghi chú
                  </label>
                  <TextArea
                    id="note"
                    className="booking__note"
                    placeholder="Yêu cầu thêm... (nhạc cụ, số người, thời lượng...)"
                    size="large"
                    spellCheck={false}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {/* Button actions */}
                <div className="booking__actions">
                  <button
                    type="reset"
                    className="booking__btn booking__btn--delete"
                  >
                    Xóa
                  </button>
                  <button
                    type="submit"
                    className="booking__btn booking__btn--request"
                    disabled={!isFormValid}
                  >
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
