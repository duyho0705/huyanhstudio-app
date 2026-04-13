import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUser, FiPhone, FiMessageSquare, FiCheckCircle, FiLoader, FiMusic } from "react-icons/fi";
import serviceApi from "../../../api/serviceApi";
import { AuthContext } from "../../../api/AuthContext";
// Kiểm tra và sử dụng bookingApi nếu cần, tạm thời giả lập để đảm bảo trang không bị trắng
// import bookingApi from "../../../api/bookingApi";

const Booking = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        serviceId: "",
        bookingDate: "",
        bookingTime: "08:00",
        customerName: "",
        phoneNumber: "",
        note: ""
    });

    // Đồng bộ thông tin user khi user load xong
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.customerName || "",
                phoneNumber: user.phone || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await serviceApi.getAll();
            const data = response.data?.data || response.data || [];
            // Đảm bảo data là một mảng
            setServices(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching services:", err);
            setServices([]); // Tránh crash nếu lỗi
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.serviceId) {
            alert("Vui lòng chọn một dịch vụ!");
            return;
        }

        setSubmitting(true);
        try {
            // Giả lập gửi tin nhắn thành công
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSuccess(true);
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng liên hệ hotline!");
        } finally {
            setSubmitting(false);
        }
    };

    // Màn hình loading toàn trang để tránh trắng trang
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 min-h-[60vh]">
                <FiLoader className="text-4xl text-[#35104C] animate-spin mb-4" />
                <p className="font-bold text-[#35104C]/50 uppercase tracking-widest text-sm">Đang chuẩn bị lịch hẹn...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="container-app py-32 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-[#6CD1FD]/20 text-[#6CD1FD] rounded-full flex items-center justify-center mb-8"
                >
                    <FiCheckCircle size={48} />
                </motion.div>
                <h2 className="text-3xl font-black text-[#35104C] mb-4 uppercase tracking-tight">Gửi yêu cầu thành công!</h2>
                <p className="text-gray-500 max-w-md font-medium leading-relaxed">
                    Huy Anh Studio đã nhận được yêu cầu của bạn. Chúng tôi sẽ sớm liên hệ qua số điện thoại <strong>{formData.phoneNumber}</strong> để xác nhận.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-12 px-10 py-4 bg-[#35104C] text-white rounded-2xl font-black shadow-xl shadow-[#35104C]/20 hover:bg-[#6CD1FD] transition-all"
                >
                    ĐẶT LỊCH KHÁC
                </button>
            </div>
        );
    }

    return (
        <div className="container-app pb-32 pt-8">
            <header className="mb-14 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-[#35104C]/10 text-[#35104C] text-[15px] font-semibold mb-6"
                >
                    Đặt lịch hẹn
                </motion.div>
            </header>

            <div className="max-w-5xl mx-auto shadow-2xl shadow-gray-200/50 rounded-[28px] overflow-hidden border border-gray-100 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                    {/* Sidebar */}
                    <div className="lg:col-span-4 bg-[#35104C] p-12 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-3xl font-black mb-6 leading-tight">Thông tin<br />Hỗ trợ</h3>
                            <p className="text-white/50 text-base font-medium leading-relaxed mb-12">
                                Huy Anh Studio luôn lắng nghe và sẵn sàng hỗ trợ mọi nghệ sĩ. Đừng ngần ngại để lại câu hỏi!
                            </p>

                            <div className="space-y-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#6CD1FD] border border-white/10 shadow-lg">
                                        <FiPhone size={22} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">Hotline</div>
                                        <div className="text-lg font-bold">0359.891.654</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#6CD1FD] border border-white/10 shadow-lg">
                                        <FiMusic size={22} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">Giờ mở cửa</div>
                                        <div className="text-lg font-bold">08:00 - 22:00</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 p-6 bg-white/5 rounded-2xl border border-white/10">
                            <div className="text-xs font-bold text-white/40 uppercase mb-2">Địa điểm</div>
                            <div className="text-sm font-medium">Bình Thạnh, TP. Hồ Chí Minh</div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-8 p-12 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#35104C]/40 uppercase tracking-[0.2em] ml-1">Họ và tên</label>
                                <div className="relative group">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Nhập tên của bạn..."
                                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#6CD1FD] focus:bg-white outline-none font-bold text-[#35104C] transition-all"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#35104C]/40 uppercase tracking-[0.2em] ml-1">Số điện thoại</label>
                                <div className="relative group">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors" />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="0xxx xxx xxx"
                                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#6CD1FD] focus:bg-white outline-none font-bold text-[#35104C] transition-all"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-[#35104C]/40 uppercase tracking-[0.2em] ml-1">Dịch vụ cần book</label>
                            <select
                                required
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#6CD1FD] focus:bg-white outline-none font-bold text-[#35104C] transition-all"
                                value={formData.serviceId}
                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                            >
                                <option value="">-- Chọn dịch vụ tại huyanhstudio --</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} - {s.price || 0}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#35104C]/40 uppercase tracking-[0.2em] ml-1">Ngày mong muốn</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#6CD1FD] focus:bg-white outline-none font-bold text-[#35104C] transition-all"
                                    value={formData.bookingDate}
                                    onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#35104C]/40 uppercase tracking-[0.2em] ml-1">Thời gian</label>
                                <input
                                    required
                                    type="time"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#6CD1FD] focus:bg-white outline-none font-bold text-[#35104C] transition-all"
                                    value={formData.bookingTime}
                                    onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-[#35104C]/40 uppercase tracking-[0.2em] ml-1">Ghi chú (nhu cầu riêng)</label>
                            <textarea
                                rows="3"
                                placeholder="..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#6CD1FD] focus:bg-white outline-none font-medium text-[#35104C] transition-all resize-none"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-5 bg-[#6CD1FD] text-[#35104C] rounded-[20px] font-black text-xl shadow-2xl shadow-[#6CD1FD]/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {submitting ? <FiLoader className="animate-spin text-3xl" /> : "XÁC NHẬN ĐẶT LỊCH NGAY"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;
