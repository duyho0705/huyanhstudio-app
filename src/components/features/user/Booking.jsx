import useAuthStore from "../../../stores/useAuthStore";
import useAppStore from "../../../stores/useAppStore";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiUser, FiPhone, FiCheckCircle, FiLoader, FiMusic, FiMapPin, FiMail, FiLayout } from "react-icons/fi";
import { Select, DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import serviceApi from "../../../api/serviceApi";
import studioRoomApi from "../../../api/studioRoomApi";
import bookingApi from "../../../api/bookingApi";
import bookingImg from "../../../assets/booking.jpg";


const Booking = () => {
    const { t } = useTranslation();
    const user = useAuthStore(state => state.user);
    const [services, setServices] = useState([]);
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        serviceId: null,
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
        if (!formData.serviceId) newErrors.serviceId = true;
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
                serviceId: formData.serviceId,
                needConsultation: formData.needConsultation,
                note: formData.note
            };

            await bookingApi.create(payload);
            setSuccess(true);
        } catch (err) {
            alert(t('booking_page.form.error_msg'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 min-h-[60vh]">
                <FiLoader className="text-4xl text-[#35104C] animate-spin mb-4" />
                <p className="text-[#35104C]/50 text-sm tracking-normal">{t('common.loading')}</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="container-app py-12 sm:py-24 flex items-center justify-center min-h-[70vh] relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#6CD1FD]/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#35104C]/5 rounded-full blur-[120px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-[0_40px_120px_-20px_rgba(53,16,76,0.15)] overflow-hidden border border-gray-100 relative z-10"
                >
                    {/* Visual Section */}
                    <div className="bg-[#F8FAFC] p-8 sm:p-12 flex items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                            className="relative z-10"
                        >
                            <img
                                src="/images/booking-success.png"
                                alt="Booking Success"
                                className="w-full max-w-[320px] drop-shadow-[0_20px_50px_rgba(108,209,253,0.3)]"
                            />
                        </motion.div>

                        {/* Subtle Badge Removed */}
                    </div>

                    {/* Content Section */}
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="inline-block px-4 py-1.5 bg-[#6CD1FD]/10 text-[#6CD1FD] text-[11px] font-black rounded-full mb-6 uppercase tracking-widest border border-[#6CD1FD]/20">
                                {t('booking_page.form.success_badge')}
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-[#35104C] leading-[1.1] mb-6">
                                {t('booking_page.form.success_title')}
                            </h2>
                        </motion.div>

                        <div className="space-y-6 mb-10">
                            <p className="text-gray-500 font-medium leading-relaxed text-[15px]">
                                {t('booking_page.form.success_desc', { name: formData.customerName })}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#F8FAFC] rounded-[24px] border border-gray-100 group hover:border-[#6CD1FD]/30 transition-colors">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('booking_page.form.success_service')}</div>
                                    <div className="text-sm font-bold text-[#35104C] truncate">
                                        {services.find(s => s.id === formData.serviceId)?.name || t('booking_page.form.service_placeholder')}
                                    </div>
                                </div>
                                <div className="p-4 bg-[#F8FAFC] rounded-[24px] border border-gray-100 group hover:border-[#6CD1FD]/30 transition-colors">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('booking_page.form.success_date')}</div>
                                    <div className="text-sm font-bold text-[#35104C]">
                                        {formData.bookingDate?.format("DD/MM/YYYY")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSuccess(false);
                                    setFormData({
                                        ...formData,
                                        serviceId: null,
                                        bookingDate: null,
                                        note: "",
                                        needConsultation: false
                                    });
                                }}
                                className="w-full h-14 bg-[#35104C] text-white rounded-[20px] font-bold shadow-xl shadow-[#35104C]/20 hover:bg-[#6CD1FD] transition-all flex items-center justify-center gap-3 group"
                            >
                                {t('booking_page.form.success_rebook')}
                                <FiCalendar className="text-lg group-hover:rotate-12 transition-transform" />
                            </motion.button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-3 text-gray-400 hover:text-[#35104C] font-bold transition-colors text-sm uppercase tracking-widest"
                            >
                                {t('booking_page.form.success_home')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container-app pb-12 sm:pb-16 sm:pt-0 lg:-mt-4 px-3 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-0 lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] lg:rounded-[32px] lg:overflow-hidden lg:bg-white lg:border lg:border-gray-100">
                    <div className="lg:col-span-4 bg-[#311142] p-5 sm:p-10 lg:p-8 flex flex-col justify-between relative overflow-hidden rounded-[24px] lg:rounded-none shadow-xl lg:shadow-none">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#6CD1FD]/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="text-white text-[13px] sm:text-[15px] font-medium leading-relaxed mb-4 sm:mb-10 lg:mb-14 max-w-none lg:max-w-[240px]">
                                {t('booking_page.side_note')}
                                <br />
                                <br />
                                {t('booking_page.side_tips_title')}
                                <ul className="mt-2 space-y-1 list-disc pl-5">
                                    {t('booking_page.side_tips', { returnObjects: true }).map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="relative z-10 my-6 lg:my-8">
                            <div className="aspect-video lg:aspect-[4/3] w-full rounded-[24px] overflow-hidden border border-white/10 shadow-2xl">
                                <img
                                    src={bookingImg}
                                    alt="Booking Hastudio"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-8 p-4 sm:p-8 lg:p-10 bg-white rounded-[24px] lg:rounded-none shadow-xl lg:shadow-none">
                        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm sm:text-[15px] font-semibold text-slate-600 px-1">{t('booking_page.form.name_label')} <span className="text-red-400">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors">
                                        <FiUser size={14} className="sm:hidden" />
                                        <FiUser size={18} className="hidden sm:block" />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder={t('booking_page.form.name_placeholder')}
                                        className={`w-full h-[36px] sm:h-[48px] pl-10 sm:pl-13 pr-4 bg-white border ${errors.customerName ? "border-red-500" : "border-[#E2E8F0]"} rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-slate-600 placeholder:text-gray-400/50 placeholder:font-medium placeholder:text-[12px] sm:placeholder:text-[15px] transition-all text-sm`}
                                        value={formData.customerName}
                                        onChange={(e) => {
                                            setFormData({ ...formData, customerName: e.target.value });
                                            if (errors.customerName) setErrors({ ...errors, customerName: false });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 sm:gap-x-6 sm:gap-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm sm:text-[15px] font-semibold text-slate-600 px-1">{t('booking_page.form.phone_label')} <span className="text-red-400">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors">
                                            <FiPhone size={14} className="sm:hidden" />
                                            <FiPhone size={18} className="hidden sm:block" />
                                        </div>
                                        <input
                                            required
                                            type="tel"
                                            placeholder={t('booking_page.form.phone_placeholder')}
                                            className={`w-full h-[36px] sm:h-[48px] pl-10 sm:pl-13 pr-4 bg-white border ${errors.phoneNumber ? "border-red-500" : "border-[#E2E8F0]"} rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-slate-600 placeholder:text-gray-400/50 placeholder:font-medium placeholder:text-[12px] sm:placeholder:text-[15px] transition-all text-sm`}
                                            value={formData.phoneNumber}
                                            onChange={(e) => {
                                                setFormData({ ...formData, phoneNumber: e.target.value });
                                                if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: false });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm sm:text-[15px] font-semibold text-slate-600 px-1">{t('booking_page.form.email_label')} <span className="text-red-400">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors">
                                            <FiMail size={14} className="sm:hidden" />
                                            <FiMail size={18} className="hidden sm:block" />
                                        </div>
                                        <input
                                            required
                                            type="email"
                                            placeholder={t('booking_page.form.email_placeholder')}
                                            className={`w-full h-[36px] sm:h-[48px] pl-10 sm:pl-13 pr-4 bg-white border ${errors.email ? "border-red-500" : "border-[#E2E8F0]"} rounded-full focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-slate-600 placeholder:text-gray-400/50 placeholder:font-medium placeholder:text-[12px] sm:placeholder:text-[15px] transition-all text-sm`}
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
                                        controlHeight: 40,
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
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-x-6 sm:gap-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm sm:text-[15px] font-semibold text-slate-600 px-1">{t('booking_page.form.service_label')} <span className="text-red-400">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors pointer-events-none z-10">
                                                <FiMusic size={14} className="sm:hidden" />
                                                <FiMusic size={18} className="hidden sm:block" />
                                            </div>
                                            <Select
                                                size="large"
                                                status={errors.serviceId ? "error" : ""}
                                                placeholder={t('booking_page.form.service_placeholder')}
                                                className="w-full custom-antd-select-with-icon font-medium text-[12px] sm:text-sm h-[36px] sm:h-[48px]"
                                                value={formData.serviceId}
                                                onChange={(val) => {
                                                    setFormData({ ...formData, serviceId: val });
                                                    if (errors.serviceId) setErrors({ ...errors, serviceId: false });
                                                }}
                                                options={services.map(s => ({ value: s.id, label: s.name }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm sm:text-[15px] font-semibold text-slate-600 px-1">{t('booking_page.form.studio_label')} <span className="text-red-400">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors pointer-events-none z-10">
                                                <FiLayout size={14} className="sm:hidden" />
                                                <FiLayout size={18} className="hidden sm:block" />
                                            </div>
                                            <Select
                                                size="large"
                                                status={errors.studioRoomId ? "error" : ""}
                                                placeholder={t('booking_page.form.studio_placeholder')}
                                                className="w-full custom-antd-select-with-icon font-medium text-[12px] sm:text-sm h-[36px] sm:h-[48px]"
                                                value={formData.studioRoomId}
                                                disabled={studios?.length <= 1}
                                                onChange={(val) => {
                                                    setFormData({ ...formData, studioRoomId: val });
                                                    if (errors.studioRoomId) setErrors({ ...errors, studioRoomId: false });
                                                }}
                                                options={studios.map(s => ({ value: s.id, label: s.studioName }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1 mt-3 sm:mt-4">
                                    <label className="text-sm sm:text-[15px] font-semibold text-slate-600 px-1">{t('booking_page.form.date_label')} <span className="text-red-400">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6CD1FD] transition-colors pointer-events-none z-10">
                                            <FiCalendar size={14} className="sm:hidden" />
                                            <FiCalendar size={18} className="hidden sm:block" />
                                        </div>
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            size="large"
                                            status={errors.bookingDate ? "error" : ""}
                                            placeholder={t('booking_page.form.date_placeholder')}
                                            suffixIcon={null}
                                            className="w-full custom-antd-datepicker-with-icon font-medium text-[12px] sm:text-sm h-[36px] sm:h-[48px]"
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

                            <div className="space-y-1">
                                <label className="text-sm sm:text-[15px] font-semibold text-slate-600 px-1">{t('booking_page.form.note_label')}</label>
                                <textarea
                                    rows="3"
                                    placeholder={t('booking_page.form.note_placeholder')}
                                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white border border-[#E2E8F0] rounded-[20px] sm:rounded-[24px] focus:bg-white focus:border-[#6CD1FD] focus:shadow-[0_0_0_4px_rgba(108,209,253,0.1)] outline-none font-medium text-slate-600 transition-all resize-none text-sm placeholder:text-gray-400/50 placeholder:font-medium placeholder:text-[13px] sm:placeholder:text-[15px]"
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
                                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${formData.needConsultation
                                            ? "bg-[#6CD1FD] border-[#6CD1FD] shadow-lg shadow-[#6CD1FD]/20"
                                            : "border-slate-200 bg-white group-hover:border-slate-300"
                                            }`}>
                                            {formData.needConsultation && (
                                                <FiCheckCircle className="text-white" size={14} />
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm sm:text-[15px] font-semibold text-slate-600 transition-colors group-hover:text-slate-900">
                                        {t('booking_page.form.consult_label')}
                                    </span>
                                </label>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2 sm:py-3 bg-[#6CD1FD] text-white rounded-full font-bold text-[15px] sm:text-lg shadow-[0_15px_35px_-5px_rgba(108,209,253,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 relative mt-2"
                            >
                                <span className="relative z-10">
                                    {submitting ? t('booking_page.form.submitting') : t('booking_page.form.submit_btn')}
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
                    height: inherit !important;
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
                    padding-left: 2.5rem !important;
                }
                @media (min-width: 640px) {
                    .custom-antd-select-with-icon .ant-select-selector,
                    .custom-antd-datepicker-with-icon {
                        padding-left: 3.25rem !important;
                    }
                }
                .custom-antd-datepicker .ant-picker-input > input {
                    font-weight: 500;
                    color: #475569;
                }
                .custom-antd-select .ant-select-selection-placeholder,
                .custom-antd-datepicker .ant-picker-input > input::placeholder {
                    font-weight: 500 !important;
                    font-size: 12px !important;
                    color: rgba(156, 163, 175, 0.5) !important;
                }
                @media (min-width: 640px) {
                    .custom-antd-select .ant-select-selection-placeholder,
                    .custom-antd-datepicker .ant-picker-input > input::placeholder {
                        font-size: 15px !important;
                    }
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
