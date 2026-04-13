import { useState, useEffect, useContext } from "react";
import userApi from "../../../api/userApi.js";
import { AuthContext } from "../../../api/AuthContext.jsx";
import { User, Mail, Phone, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const AdminAccount = ({ onClose, isOpen }) => {
  const { user, loadProfile } = useContext(AuthContext);

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
    setCustomerName(user.customerName || "");
    setPhone(user.phone || "");
    setEmail(user.email || "");
  }, [user]);

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
      newErrors.customerName = "Tên không được để trống";
    } else if (!nameRegex.test(customerName.trim())) {
      newErrors.customerName = "Tên không hợp lệ";
    }

    const phoneRegex = /^(0[3|5|7|8|9])\d{8}$/;
    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ";
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
        onClose({ success: true, message: "Cập nhật thành công!" });
      }
    } catch (err) {
      setNotification({
        show: true,
        message: err.response?.data?.message || "Cập nhật thất bại!",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-2">
      {notification.show && (
        <div className={`fixed top-24 right-6 z-[2000] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 animate-slide-in-right bg-white ${notification.type === "error" ? "border-red-100" : "border-green-100"
          }`}>
          <div className={`p-2 rounded-xl ${notification.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {notification.type === "error" ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">{notification.type === "error" ? "Lỗi cập nhật" : "Thành công"}</span>
            <span className="text-xs text-slate-500 font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-700 ml-1">
              <User size={18} className="text-blue-500" />
              Tên tài khoản
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.customerName)
                  setErrors({ ...errors, customerName: null });
              }}
              placeholder="Nhập tên"
              className={`w-full h-12 px-5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all font-medium text-slate-900 ${errors.customerName ? "border-red-200 focus:ring-red-50 focus:border-red-400" : "border-slate-200 focus:ring-blue-50 focus:border-blue-400"
                }`}
            />
            {errors.customerName && (
              <span className="text-[11px] font-bold text-red-500 ml-1">{errors.customerName}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-700 ml-1">
              <Phone size={18} className="text-blue-500" />
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder="Nhập SĐT"
              className={`w-full h-12 px-5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all font-medium text-slate-900 ${errors.phone ? "border-red-200 focus:ring-red-50 focus:border-red-400" : "border-slate-200 focus:ring-blue-50 focus:border-blue-400"
                }`}
            />
            {errors.phone && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.phone}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between text-[15px] font-semibold text-slate-700 ml-1">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-blue-500" />
              Email
            </div>
            {user?.isVerified && (
              <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-green-100">
                <CheckCircle2 size={12} />
                Đã xác thực
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
            placeholder="Nhập email"
            className={`w-full h-12 px-5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all font-medium text-slate-900 ${errors.email ? "border-red-200 focus:ring-red-50 focus:border-red-400" : "border-slate-200 focus:ring-blue-50 focus:border-blue-400"
              }`}
          />
          {errors.email && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.email}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-slate-900 disabled:bg-slate-400 text-white rounded-2xl font-semibold text-[16px] hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200 mt-4 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <CheckCircle2 size={20} />
          )}
          {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default AdminAccount;
