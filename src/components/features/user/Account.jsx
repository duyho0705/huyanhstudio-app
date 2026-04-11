import { useState, useEffect, useContext } from "react";
import userApi from "../../../api/userApi.js";
import { AuthContext } from "../../../api/AuthContext.jsx";

const Account = () => {
  const { user, loadProfile } = useContext(AuthContext);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (!user) return;
    setCustomerName(user.name || "");
    setPhone(user.phone || "");
    setEmail(user.email || "");
  }, [user]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => setNotification({ show: false, message: "", type: "" }), 700);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[\p{L}][\p{L}\s.'-]*[\p{L}]$/u;
    if (!customerName.trim()) newErrors.customerName = "Tên không được để trống";
    else if (!nameRegex.test(customerName.trim())) newErrors.customerName = "Tên chỉ được chứa chữ cái";
    const phoneRegex = /^(0[3|5|7|8|9])\d{8}$/;
    if (!phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Số điện thoại không hợp lệ";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email không được để trống";
    else if (!emailRegex.test(email)) newErrors.email = "Email không hợp lệ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !validateForm()) return;
    try {
      await userApi.updateProfile({ customerName: customerName.trim(), phone, email: email.trim() });
      await loadProfile();
      setNotification({ show: true, message: "Cập nhật thành công!", type: "success" });
    } catch (err) {
      console.error(err);
      setNotification({ show: true, message: "Cập nhật thất bại!", type: "error" });
    }
  };

  const InputField = ({ label, value, onChange, error, ...props }) => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all bg-gray-50 focus:bg-white ${
          error ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
          <InputField label="Tên người dùng" value={customerName} onChange={(e) => { setCustomerName(e.target.value); if (errors.customerName) setErrors({ ...errors, customerName: null }); }} error={errors.customerName} />
          <InputField label="Số điện thoại" value={phone} onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: null }); }} error={errors.phone} />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="flex gap-3 items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: null }); }}
              className={`flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none transition-all bg-gray-50 focus:bg-white ${
                errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
              }`}
            />
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
              user?.isVerified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
            }`}>
              {user?.isVerified ? "Đã xác thực" : "Chưa xác thực"}
            </span>
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button type="submit" className="px-8 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl shadow-md shadow-blue-200 hover:opacity-90 transition-all">
            Lưu thay đổi
          </button>

          {notification.show && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium animate-fade-in ${
              notification.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
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
