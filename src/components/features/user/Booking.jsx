import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiUser, FiPhone, FiCheckCircle, FiLoader, FiMusic, FiMapPin, FiMail, FiLayout } from "react-icons/fi";
import { Select, DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import serviceApi from "../../../api/serviceApi";
import studioRoomApi from "../../../api/studioRoomApi";
import bookingApi from "../../../api/bookingApi";
import { AuthContext } from "../../../api/AuthContext";

const Booking = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        serviceIds: [],
        studioRoomId: null,
        bookingDate: null,
        customerName: "",
        phoneNumber: "",
        email: "",
        note: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.customerName || "",
                phoneNumber: user.phone || "",
                email: user.email || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [serviceRes, studioRes] = await Promise.all([
                serviceApi.getAll(),
                studioRoomApi.getAll()
            ]);

            const serviceData = serviceRes.data?.data || serviceRes.data || [];
            const studioData = studioRes.data?.data || studioRes.data || [];

            const validServices = Array.isArray(serviceData) ? serviceData : [];
            const validStudios = Array.isArray(studioData) ? studioData : [];
            setServices(validServices);
            setStudios(validStudios);

            // Default to the first studio room
            if (validStudios.length > 0) {
                setFormData(prev => ({ ...prev, studioRoomId: validStudios[0].id }));
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setServices([]);
            setStudios([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.serviceIds || formData.serviceIds.length === 0) {
            alert("Vui lòng chọn ít nhất một dịch vụ!");
            return;
        }
        if (!formData.studioRoomId) {
            alert("Vui lòng chọn studio phòng thu!");
            return;
        }
        if (!formData.bookingDate) {
            alert("Vui lòng chọn ngày thu âm!");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                customerName: formData.customerName,
                phone: formData.phoneNumber.replace(/\D/g, ""), // Sanitize phone
                email: formData.email,
                recordDate: formData.bookingDate.format("YYYY-MM-DD"),
                studioRoomId: Number(formData.studioRoomId),
                serviceIds: formData.serviceIds,
                note: formData.note
            };

            await bookingApi.create(payload);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng liên hệ hotline!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 min-h-[60vh]">
                <FiLoader className="text-4xl text-[#35104C] animate-spin mb-4" />
                <p className="font-bold text-[#35104C]/50 uppercase tracking-widest text-sm">Đang tải...</p>
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
                    Huy Anh Studio đã nhận được yêu cầu đặt lịch của bạn. Chúng tôi sẽ sớm liên hệ qua số điện thoại <strong>{formData.phoneNumber}</strong> để xác nhận.
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
        <div className="container-app pb-16 pt-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden bg-white border border-gray-100"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-max">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-4 bg-[#311142] p-8 flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#6CD1FD]/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-[32px] font-black text-white leading-[1.1] mb-6 decoration-sky-400">
                                Thông tin<br />Hỗ trợ
                            </h2>
                            <p className="text-white/60 text-[15px] font-medium leading-relaxed mb-14 max-w-[240px]">
                                Huy Anh Studio luôn lắng nghe và sẵn sàng hỗ trợ mọi nghệ sĩ. Đừng ngần ngại để lại câu hỏi!
                            </p>

                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-[#6CD1FD] shadow-lg backdrop-blur-sm border border-white/5">
                                        <FiPhone size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-[0.15em] mb-1">Hotline</div>
                                        <div className="text-[17px] font-bold text-white">0359.891.654</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-[#6CD1FD] shadow-lg backdrop-blur-sm border border-white/5">
                                        <FiMusic size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-[0.15em] mb-1">Giờ mở cửa</div>
                                        <div className="text-[17px] font-bold text-white">08:00 - 22:00</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12">
                            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="text-[10px] uppercase font-bold text-white/40 tracking-[0.15em] mb-2 flex items-center gap-2">
                                    <FiMapPin className="text-[#6CD1FD]" /> Địa điểm
                                </div>
                                <div className="text-sm font-semibold text-white/90">Bình Thạnh, TP. Hồ Chí Minh</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="lg:col-span-8 p-6 lg:p-10 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Row 1: Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-[15px] font-semibold text-slate-600 px-1">Họ và tên <span className="text-red-400">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors">
                                        <FiUser size={18} />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Nhập họ tên"
                                        className="w-full h-[48px] pl-13 pr-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-bold text-[#311142] placeholder:text-gray-400/60 placeholder:font-medium transition-all text-sm"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Row 2: Phone and Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[15px] font-semibold text-slate-600 px-1">Số điện thoại <span className="text-red-400">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors">
                                            <FiPhone size={18} />
                                        </div>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Nhập số điện thoại"
                                            className="w-full h-[48px] pl-13 pr-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-bold text-[#311142] placeholder:text-gray-400/60 placeholder:font-medium transition-all text-sm"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[15px] font-semibold text-slate-600 px-1">Email <span className="text-red-400">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors">
                                            <FiMail size={18} />
                                        </div>
                                        <input
                                            required
                                            type="email"
                                            placeholder="Nhập email"
                                            className="w-full h-[48px] pl-13 pr-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-bold text-[#311142] placeholder:text-gray-400/60 placeholder:font-medium transition-all text-sm"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#6CD1FD',
                                        borderRadius: 9999,
                                        controlHeightLG: 48,
                                        colorBorder: '#E2E8F0',
                                        colorBgContainer: '#F8FAFC',
                                        colorText: '#311142',
                                        fontFamily: 'inherit',
                                    },
                                    components: {
                                        Select: {
                                            selectorBg: '#F8FAFC',
                                            hoverBorderColor: '#E2E8F0',
                                            activeBorderColor: '#6CD1FD',
                                            activeOutlineColor: 'transparent',
                                        },
                                        DatePicker: {
                                            hoverBorderColor: '#E2E8F0',
                                            activeBorderColor: '#6CD1FD',
                                        }
                                    }
                                }}
                            >
                                {/* Row 3: Service and Studio Room */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[15px] font-semibold text-slate-600 px-1">Dịch vụ <span className="text-red-400">*</span></label>
                                        <div className="relative group">
                                            <Select
                                                mode="multiple"
                                                size="large"
                                                placeholder="Chọn dịch vụ"
                                                className="w-full custom-antd-select font-bold text-sm min-h-[48px]"
                                                value={formData.serviceIds}
                                                onChange={(val) => setFormData({ ...formData, serviceIds: val })}
                                                options={services.map(s => ({ value: s.id, label: s.name }))}
                                                maxTagCount="responsive"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[15px] font-semibold text-slate-600 px-1">Studio Room <span className="text-red-400">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-[24px] -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors pointer-events-none z-10">
                                                <FiLayout size={18} />
                                            </div>
                                            <Select
                                                size="large"
                                                placeholder="Chọn phòng"
                                                className="w-full custom-antd-select-with-icon font-bold text-sm h-[48px]"
                                                value={formData.studioRoomId}
                                                onChange={(val) => setFormData({ ...formData, studioRoomId: val })}
                                                options={studios.map(s => ({ value: s.id, label: s.studioName }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 4: Date */}
                                <div className="space-y-1.5 mt-4">
                                    <label className="text-[15px] font-semibold text-slate-600 px-1">Ngày thu <span className="text-red-400">*</span></label>
                                    <div className="relative group">
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            size="large"
                                            placeholder="Chọn ngày thu"
                                            className="w-full custom-antd-datepicker font-bold text-sm h-[48px]"
                                            value={formData.bookingDate}
                                            onChange={(val) => setFormData({ ...formData, bookingDate: val })}
                                            disabledDate={(current) => current && current <= dayjs().startOf('day')}
                                        />
                                    </div>
                                </div>
                            </ConfigProvider>

                            {/* Row 5: Note */}
                            <div className="space-y-1.5">
                                <label className="text-[15px] font-semibold text-slate-600 px-1">Ghi chú</label>
                                <textarea
                                    rows="3"
                                    placeholder="Nhập ghi chú"
                                    className="w-full px-6 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[24px] focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-[#311142] transition-all resize-none text-sm placeholder:text-gray-400"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                ></textarea>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-[#6CD1FD] text-white rounded-full font-bold text-lg shadow-[0_15px_35px_-5px_rgba(108,209,253,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 relative mt-2"
                            >
                                <span className="relative z-10">
                                    {submitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                                </span>
                                {submitting && <FiLoader className="animate-spin text-2xl relative z-10" />}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .pl-13 { padding-left: 3.25rem; }
                .py-4.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
                
                /* Override default browser autofill styles */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active{
                    -webkit-box-shadow: 0 0 0 30px #F8FAFC inset !important;
                    -webkit-text-fill-color: #311142 !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                input:focus:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
                }

                /* Custom styles to hide native icons and show ours */
                .custom-date-input::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    cursor: pointer;
                    position: absolute;
                    right: 0;
                    width: 100%;
                    height: 100%;
                }

                /* Custom Ant Design overrides to match our UI */
                .custom-antd-select .ant-select-selector,
                .custom-antd-select-with-icon .ant-select-selector,
                .custom-antd-datepicker {
                    transition: all 0.3s;
                }
                .custom-antd-select.ant-select-focused .ant-select-selector,
                .custom-antd-select-with-icon.ant-select-focused .ant-select-selector,
                .custom-antd-datepicker.ant-picker-focused {
                    background-color: white !important;
                    box-shadow: 0 0 0 4px rgba(108, 209, 253, 0.1) !important;
                    border-color: #6CD1FD !important;
                }
                .custom-antd-select-with-icon .ant-select-selector {
                    padding-left: 2.75rem !important;
                }
                .custom-antd-datepicker .ant-picker-input > input {
                    font-weight: 700;
                    color: #311142;
                }
                .custom-antd-select .ant-select-selection-placeholder,
                .custom-antd-datepicker .ant-picker-input > input::placeholder {
                    font-weight: 500 !important;
                }

                @keyframes shine {
                    100% {
                        left: 125%;
                    }
                }
                .group-hover\\:animate-shine {
                    animation: shine 0.75s;
                }
            `}} />
        </div>
    );
};

export default Booking;

