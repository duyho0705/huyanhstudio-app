import useAuthStore from "../../../stores/useAuthStore";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import userApi from "../../../api/userApi.js";
import { User, Mail, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { removeVietnameseTones } from "../../../utils/removeVietnameseTones";

const AdminAccount = ({ onClose, isOpen }) => {
  const { t, i18n } = useTranslation();
  const user = useAuthStore(state => state.user);
  const loadProfile = useAuthStore(state => state.loadProfile);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (isOpen) {
      setNotification({ show: false, message: "", type: "" });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!user) {
      setCustomerName("");
      setPhone("");
      setEmail("");
      return;
    }
    const name = user.customerName || "";
    setCustomerName(i18n.language === 'en' ? removeVietnameseTones(name) : name);
    setPhone(user.phone || "");
    setEmail(user.email || "");
  }, [user, i18n.language]);

  useEffect(() => {
    if (notification.show && notification.type === "error") {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show, notification.type]);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[\p{L}][\p{L}\s.'-]*[\p{L}]$/u;
    if (!customerName.trim()) {
      newErrors.customerName = t('common.error');
    } else if (!nameRegex.test(customerName.trim())) {
      newErrors.customerName = t('common.error');
    }

    const phoneRegex = /^(0[3|5|7|8|9])\d{8}$/;
    if (!phone.trim()) {
      newErrors.phone = t('common.error');
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = t('common.error');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = t('common.error');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('common.error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await userApi.updateProfile({
        customerName: customerName.trim(),
        phone,
        email: email.trim(),
      });
      await loadProfile();
      if (onClose) {
        onClose({ success: true, message: t('common.update_success') });
      }
    } catch (err) {
      setNotification({
        show: true,
        message: err.response?.data?.message || t('common.error'),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-2">
      {notification.show && (
        <div className={`fixed top-20 sm:top-24 right-3 sm:right-6 z-[2000] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl border flex items-center gap-3 sm:gap-4 animate-slide-in-right bg-white max-w-[calc(100vw-24px)] sm:max-w-none ${notification.type === "error" ? "border-red-100" : "border-green-100"
          }`}>
          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${notification.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {notification.type === "error" ? <AlertCircle size={20} className="sm:w-6 sm:h-6" /> : <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] sm:text-sm font-bold text-slate-900 truncate">{notification.type === "error" ? t('common.error') : t('common.success')}</span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">{notification.message}</span>
          </div>
        </div>
      )}

      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="flex items-center gap-2 text-[13px] sm:text-[15px] font-semibold text-slate-700 ml-1">
              <User size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500" />
              {t('admin.users.form_name')}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.customerName)
                  setErrors({ ...errors, customerName: null });
              }}
              placeholder={t('admin.users.form_name')}
              className={`w-full h-10 sm:h-12 px-4 sm:px-5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all font-medium text-[13px] sm:text-base text-slate-900 ${errors.customerName ? "border-red-200 focus:ring-red-50 focus:border-red-400" : "border-slate-200 focus:ring-blue-50 focus:border-blue-400"
                }`}
            />
            {errors.customerName && (
              <span className="text-[11px] font-bold text-red-500 ml-1">{errors.customerName}</span>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="flex items-center gap-2 text-[13px] sm:text-[15px] font-semibold text-slate-700 ml-1">
              <Phone size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500" />
              {t('admin.users.col_phone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder={t('admin.users.col_phone')}
              className={`w-full h-10 sm:h-12 px-4 sm:px-5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all font-medium text-[13px] sm:text-base text-slate-900 ${errors.phone ? "border-red-200 focus:ring-red-50 focus:border-red-400" : "border-slate-200 focus:ring-blue-50 focus:border-blue-400"
                }`}
            />
            {errors.phone && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.phone}</span>}
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label className="flex items-center justify-between text-[13px] sm:text-[15px] font-semibold text-slate-700 ml-1">
            <div className="flex items-center gap-2">
              <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500" />
              {t('admin.users.col_email')}
            </div>
            {user?.isVerified && (
              <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-green-100">
                <CheckCircle2 size={10} className="sm:w-3 sm:h-3" />
                {t('user.account.verified')}
              </span>
            )}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            placeholder="Email"
            className={`w-full h-10 sm:h-12 px-4 sm:px-5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all font-medium text-[13px] sm:text-base text-slate-900 ${errors.email ? "border-red-200 focus:ring-red-50 focus:border-red-400" : "border-slate-200 focus:ring-blue-50 focus:border-blue-400"
              }`}
          />
          {errors.email && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.email}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 sm:h-14 bg-slate-900 disabled:bg-slate-400 text-white rounded-xl sm:rounded-2xl font-semibold text-[14px] sm:text-[16px] hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200 mt-2 sm:mt-4 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <CheckCircle2 size={20} />
          )}
          {isSubmitting ? t('common.loading') : t('admin.account.save_btn')}
        </button>
      </form>
    </div>
  );
};

export default AdminAccount;
