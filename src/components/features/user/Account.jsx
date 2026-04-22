import useAuthStore from "../../../stores/useAuthStore";
import useAppStore from "../../../stores/useAppStore";
import { useState, useEffect } from "react";
import userApi from "../../../api/userApi.js";
import { useTranslation } from "react-i18next";

const Account = () => {
  const { t, i18n } = useTranslation();

  const user = useAuthStore(state => state.user);
  const loadProfile = useAuthStore(state => state.loadProfile);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const removeVietnameseTones = (str) => {
    if (!str) return "";
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẹ|Ẽ|Ê|B|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    return str;
  };

  useEffect(() => {
    if (!user) return;
    const name = user.customerName || "";
    setCustomerName(i18n.language === 'en' ? removeVietnameseTones(name) : name);
    setPhone(user.phone || "");
    setEmail(user.email || "");
  }, [user, i18n.language]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => setNotification({ show: false, message: "", type: "" }), 700);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[\p{L}][\p{L}\s.'-]*[\p{L}]$/u;
    if (!customerName.trim()) newErrors.customerName = t('user.account.errors.name_empty');
    else if (!nameRegex.test(customerName.trim())) newErrors.customerName = t('user.account.errors.name_invalid');
    const phoneRegex = /^(0[3|5|7|8|9])\d{8}$/;
    if (!phone.trim()) newErrors.phone = t('user.account.errors.phone_empty');
    else if (!phoneRegex.test(phone)) newErrors.phone = t('user.account.errors.phone_invalid');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = t('user.account.errors.email_empty');
    else if (!emailRegex.test(email)) newErrors.email = t('user.account.errors.email_invalid');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !validateForm()) return;
    try {
      await userApi.updateProfile({ customerName: customerName.trim(), phone, email: email.trim() });
      await loadProfile();
      setNotification({ show: true, message: t('user.account.update_success'), type: "success" });
    } catch (err) {
      console.error(err);
      setNotification({ show: true, message: t('user.account.update_fail'), type: "error" });
    }
  };

  const InputField = ({ label, value, onChange, error, ...props }) => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all bg-gray-50 focus:bg-white ${error ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <InputField label={t('user.account.name')} value={customerName} onChange={(e) => { setCustomerName(e.target.value); if (errors.customerName) setErrors({ ...errors, customerName: null }); }} error={errors.customerName} />
          <InputField label={t('user.account.phone')} value={phone} onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: null }); }} error={errors.phone} />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('user.account.email')}</label>
          <div className="flex gap-3 items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: null }); }}
              className={`flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none transition-all bg-gray-50 focus:bg-white ${errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
            />
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${user?.isVerified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
              }`}>
              {user?.isVerified ? t('user.account.verified') : t('user.account.unverified')}
            </span>
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button type="submit" className="px-8 py-3 text-[14px] font-semibold text-white bg-[#35104C] rounded-xl shadow-lg shadow-[#35104C]/20 transition-all">
            {t('user.account.save_btn')}
          </button>

          {notification.show && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium animate-fade-in ${notification.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
              <span>{notification.type === "success" ? "✓" : "✕"}</span>
              <span>{notification.message}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Account;
