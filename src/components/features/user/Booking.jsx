import useAuthStore from "../../../stores/useAuthStore";
import useAppStore from "../../../stores/useAppStore";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiUser, FiPhone, FiCheckCircle, FiLoader, FiMusic, FiMapPin, FiMail, FiLayout } from "react-icons/fi";
import { Select, DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import serviceApi from "../../../api/serviceApi";
import studioRoomApi from "../../../api/studioRoomApi";
import bookingApi from "../../../api/bookingApi";


const Booking = () => {
    const user = useAuthStore(state => state.user);
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
        needConsultation: false,
        note: ""
    });

    const [errors, setErrors] = useState({});

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
                serviceApi.getAll().catch(err => {
                    return { list: [] };
                }),
                studioRoomApi.getAll().catch(err => {
                    return { list: [] };
                })
            ]);

            const getList = (res) => {
                if (!res) return [];
                if (Array.isArray(res)) return res;
                if (res.list && Array.isArray(res.list)) return res.list;
                if (res.content && Array.isArray(res.content)) return res.content;
                if (res.data) {
                    if (Array.isArray(res.data)) return res.data;
                    if (res.data.list && Array.isArray(res.data.list)) return res.data.list;
                    if (res.data.content && Array.isArray(res.data.content)) return res.data.content;
                }
                return [];
            };

            const validServices = getList(serviceRes);
            const validStudios = getList(studioRes);

            setServices(validServices);
            setStudios(validStudios);

            if (validStudios.length > 0) {
                setFormData(prev => ({ ...prev, studioRoomId: validStudios[0].id }));
            }
        } catch (err) {
            setServices([]);
            setStudios([]);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerName?.trim()) newErrors.customerName = true;
        if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = true;
        if (!formData.email?.trim()) newErrors.email = true;
        if (!formData.serviceIds || formData.serviceIds.length === 0) newErrors.serviceIds = true;
        if (!formData.studioRoomId) newErrors.studioRoomId = true;
        if (!formData.bookingDate) newErrors.bookingDate = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                customerName: formData.customerName,
                phone: formData.phoneNumber.replace(/\D/g, ""), 
                email: formData.email,
                recordDate: formData.bookingDate.format("YYYY-MM-DD"),
                studioRoomId: Number(formData.studioRoomId),
                serviceIds: formData.serviceIds,
                needConsultation: formData.needConsultation,
                note: formData.note
            };

            await bookingApi.create(payload);
            setSuccess(true);
        } catch (err) {
            alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng liên hệ hotline!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 min-h-[60vh]">
                <FiLoader className="text-4xl text-[#35104C] animate-spin mb-4" />
                <p className="text-[#35104C]/50 text-sm tracking-normal">Đang tải...</p>
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
        <div className="container-app pb-16 pt-20 sm:pt-0 lg:-mt-4 px-3 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[20px] sm:rounded-[32px] overflow-hidden bg-white border border-gray-100"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-max">
                    <div className="lg:col-span-4 bg-[#311142] p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#6CD1FD]/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="text-white/60 text-[13px] sm:text-[15px] font-medium leading-relaxed mb-6 sm:mb-14 max-w-[240px]">
                                hastudio luôn lắng nghe quý khách hàng, luôn sẵn sàng hỗ trợ mọi yêu cầu của quý khách hàng! <br />Kính chúc quý khách hàng sẽ có những trải nghiệm tuyệt vời tại hastudio!
                                <br />
                                <br />
                                Những lưu ý khi đặt lịch:
                                <ul className="mt-2 space-y-1 list-disc pl-5">
                                    <li>Quý khách vui lòng điền đầy đủ thông tin</li>
                                    <li>Quý khách vui lòng chọn ngày và giờ phù hợp</li>
                                    <li>Quý khách vui lòng chọn dịch vụ phù hợp</li>
                                </ul>
                            </div>

                            <div className="space-y-4 sm:space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-[#6CD1FD] shadow-lg backdrop-blur-sm border border-white/5">
                                        <FiPhone size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[15px] font-semibold text-white/40 mb-1">Liên hệ</div>
                                        <div className="text-[17px] font-bold text-white">0359891654</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-[#6CD1FD] shadow-lg backdrop-blur-sm border border-white/5">
                                        <FiMusic size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[15px] font-semibold text-white/40 mb-1">Giờ hoạt động</div>
                                        <div className="text-[17px] font-bold text-white">08:00 - 22:00</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-6 sm:mt-12">
                            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="text-[15px]  font-semibold text-white/40 mb-2 flex items-center gap-2">
                                    <FiMapPin className="text-[#6CD1FD]" /> Địa điểm
                                </div>
                                <div className="text-sm font-semibold text-white/90">79 Võ Thị Sáu, Phú Đông, Phú Yên, Đắk Lắk, Việt Nam</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 p-4 sm:p-6 lg:p-10 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                        className={`w-full h-[48px] pl-13 pr-6 bg-white border ${errors.customerName ? "border-red-500" : "border-[#E2E8F0]"} rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-slate-600 placeholder:text-gray-400/50 placeholder:font-medium placeholder:text-[15px] transition-all text-sm`}
                                        value={formData.customerName}
                                        onChange={(e) => {
                                            setFormData({ ...formData, customerName: e.target.value });
                                            if (errors.customerName) setErrors({ ...errors, customerName: false });
                                        }}
                                    />
                                </div>
                            </div>

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
                                            className={`w-full h-[48px] pl-13 pr-6 bg-white border ${errors.phoneNumber ? "border-red-500" : "border-[#E2E8F0]"} rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-slate-600 placeholder:text-gray-400/50 placeholder:font-medium placeholder:text-[15px] transition-all text-sm`}
                                            value={formData.phoneNumber}
                                            onChange={(e) => {
                                                setFormData({ ...formData, phoneNumber: e.target.value });
                                                if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: false });
                                            }}
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
                                            className={`w-full h-[48px] pl-13 pr-6 bg-white border ${errors.email ? "border-red-500" : "border-[#E2E8F0]"} rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-slate-600 placeholder:text-gray-400/50 placeholder:font-medium placeholder:text-[15px] transition-all text-sm`}
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value });
                                                if (errors.email) setErrors({ ...errors, email: false });
                                            }}
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
                                        colorBgContainer: '#ffffff',
                                        colorText: '#475569',
                                        fontFamily: 'inherit',
                                    },
                                    components: {
                                        Select: {
                                            selectorBg: '#ffffff',
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[15px] font-semibold text-slate-600 px-1">Dịch vụ <span className="text-red-400">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors pointer-events-none z-10">
                                                <FiMusic size={18} />
                                            </div>
                                            <Select
                                                mode="multiple"
                                                size="large"
                                                status={errors.serviceIds ? "error" : ""}
                                                placeholder="Chọn dịch vụ"
                                                className="w-full custom-antd-select-with-icon font-medium text-sm min-h-[48px]"
                                                value={formData.serviceIds}
                                                onChange={(val) => {
                                                    setFormData({ ...formData, serviceIds: val });
                                                    if (errors.serviceIds) setErrors({ ...errors, serviceIds: false });
                                                }}
                                                options={services.map(s => ({ value: s.id, label: s.name }))}
                                                maxTagCount="responsive"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[15px] font-semibold text-slate-600 px-1">Phòng thu <span className="text-red-400">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-[24px] -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors pointer-events-none z-10">
                                                <FiLayout size={18} />
                                            </div>
                                            <Select
                                                size="large"
                                                status={errors.studioRoomId ? "error" : ""}
                                                placeholder="Chọn phòng"
                                                className="w-full custom-antd-select-with-icon font-medium text-sm h-[48px]"
                                                value={formData.studioRoomId}
                                                onChange={(val) => {
                                                    setFormData({ ...formData, studioRoomId: val });
                                                    if (errors.studioRoomId) setErrors({ ...errors, studioRoomId: false });
                                                }}
                                                options={studios.map(s => ({ value: s.id, label: s.studioName }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 mt-4">
                                    <label className="text-[15px] font-semibold text-slate-600 px-1">Ngày thu <span className="text-red-400">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors pointer-events-none z-10">
                                            <FiCalendar size={18} />
                                        </div>
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            size="large"
                                            status={errors.bookingDate ? "error" : ""}
                                            placeholder="Chọn ngày thu"
                                            suffixIcon={null}
                                            className="w-full custom-antd-datepicker-with-icon font-medium text-sm h-[48px]"
                                            value={formData.bookingDate}
                                            onChange={(val) => {
                                                setFormData({ ...formData, bookingDate: val });
                                                if (errors.bookingDate) setErrors({ ...errors, bookingDate: false });
                                            }}
                                            disabledDate={(current) => current && current <= dayjs().startOf('day')}
                                        />
                                    </div>
                                </div>
                            </ConfigProvider>

                            <div className="space-y-1.5">
                                <label className="text-[15px] font-semibold text-slate-600 px-1">Ghi chú</label>
                                <textarea
                                    rows="3"
                                    placeholder="Nhập ghi chú"
                                    className="w-full px-6 py-3.5 bg-white border border-[#E2E8F0] rounded-[24px] focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-slate-600 transition-all resize-none text-sm placeholder:text-gray-400/50 placeholder:font-medium placeholder:text-[15px]"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-3 px-2 py-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.needConsultation}
                                            onChange={(e) => setFormData({ ...formData, needConsultation: e.target.checked })}
                                        />
                                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                                            formData.needConsultation 
                                            ? "bg-[#6CD1FD] border-[#6CD1FD] shadow-lg shadow-[#6CD1FD]/20" 
                                            : "border-slate-200 bg-white group-hover:border-slate-300"
                                        }`}>
                                            {formData.needConsultation && (
                                                <FiCheckCircle className="text-white" size={14} />
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[15px] font-semibold text-slate-600 transition-colors group-hover:text-slate-900">
                                        Yêu cầu tư vấn qua điện thoại
                                    </span>
                                </label>
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
                
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active{
                    -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
                    -webkit-text-fill-color: #311142 !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                input:focus:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
                }

                .custom-date-input::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    cursor: pointer;
                    position: absolute;
                    right: 0;
                    width: 100%;
                    height: 100%;
                }

                .custom-antd-select .ant-select-selector,
                .custom-antd-select-with-icon .ant-select-selector,
                .custom-antd-datepicker,
                .custom-antd-datepicker-with-icon {
                    transition: all 0.3s;
                }
                .custom-antd-select.ant-select-focused .ant-select-selector,
                .custom-antd-select-with-icon.ant-select-focused .ant-select-selector,
                .custom-antd-datepicker.ant-picker-focused {
                    background-color: white !important;
                    box-shadow: 0 0 0 4px rgba(108, 209, 253, 0.1) !important;
                    border-color: #6CD1FD !important;
                }
                .custom-antd-select-with-icon .ant-select-selector,
                .custom-antd-datepicker-with-icon {
                    padding-left: 3.25rem !important;
                }
                .custom-antd-datepicker .ant-picker-input > input {
                    font-weight: 500;
                    color: #475569;
                }
                .custom-antd-select .ant-select-selection-placeholder,
                .custom-antd-datepicker .ant-picker-input > input::placeholder {
                    font-weight: 500 !important;
                    font-size: 15px !important;
                    color: rgba(156, 163, 175, 0.5) !important;
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
