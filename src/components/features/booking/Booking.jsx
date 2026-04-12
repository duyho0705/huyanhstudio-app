import bookingApi from "../../../api/bookingApi.js";
import studioRoomApi from "../../../api/studioRoomApi.js";
import { DatePicker, Select, Input, message } from "antd";
import { useEffect, useState } from "react";
import serviceApi from "../../../api/serviceApi.js";

const { Option } = Select;
const { TextArea } = Input;

const Booking = ({ selectedService }) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(null);
  const [service, setService] = useState([]);
  const [studio, setStudio] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [studioList, setStudioList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const isFormValid = fullName && phone && date && service?.length > 0 && email && studio;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, studioRes] = await Promise.all([serviceApi.getAll(), studioRoomApi.getAll()]);
        setServiceList(serviceRes.data || []);
        setStudioList(studioRes.data || []);
      } catch (err) {
        console.error(err);
        messageApi.error("Không thể tải dữ liệu");
      }
    };
    fetchData();
    if (selectedService) {
      setService(Array.isArray(selectedService) ? selectedService : [selectedService]);
    }
  }, [selectedService, messageApi]);

  const handleReset = () => {
    setFullName(""); setPhone(""); setEmail(""); setNote(""); setDate(null); setService([]); setStudio(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await bookingApi.create({ 
        customerName: fullName, 
        phone: phone.replace(/\D/g, ""), // Sanitize phone to digits only
        email, 
        recordDate: date?.format("YYYY-MM-DD"), 
        studioRoomId: studio, 
        serviceIds: service, 
        note 
      });
      messageApi.success("Đặt lịch thành công!");
      handleReset();
    } catch (error) {
      console.error(error);
      messageApi.error("Không thể gửi yêu cầu, vui lòng thử lại!");
    }
  };

  return (
    <div className="container-app py-16" id="booking">
      {contextHolder}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Đặt lịch thu âm</h2>
            <p className="text-sm text-blue-100 mt-1">Điền thông tin, chúng tôi sẽ liên hệ lại.</p>
          </div>

          <form className="p-8" onReset={handleReset} onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ tên</label>
                <Input id="fullName" placeholder="Nhập họ tên" size="large" spellCheck={false} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                <Input id="phoneNumber" placeholder="Nhập số điện thoại" size="large" spellCheck={false} required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <Input id="email" placeholder="Nhập email" size="large" spellCheck={false} required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày thu</label>
                <DatePicker 
                  id="dateToWork" 
                  placeholder="Chọn ngày thu" 
                  size="large" 
                  style={{ width: "100%" }} 
                  format="DD/MM/YYYY" 
                  value={date} 
                  onChange={(val) => setDate(val)}
                  disabledDate={(current) => current && current <= dayjs().startOf('day')}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Dịch vụ</label>
                <Select style={{ width: "100%" }} size="large" placeholder="Chọn dịch vụ" value={service} mode="multiple" onChange={(val) => setService(val)}>
                  {Array.isArray(serviceList) && serviceList.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Studio</label>
                <Select style={{ width: "100%" }} size="large" placeholder="Chọn studio" value={studio} onChange={(val) => setStudio(val)}>
                  {Array.isArray(studioList) && studioList.map((item) => (<Option key={item.id} value={item.id}>{item.studioName}</Option>))}
                </Select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú</label>
              <TextArea id="note" placeholder="Yêu cầu thêm... (nhạc cụ, số người, thời lượng...)" size="large" spellCheck={false} value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <button type="reset" className="px-6 py-2.5 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                Xóa
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="px-8 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl shadow-md shadow-blue-200 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi yêu cầu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
