import { useState, useEffect, useContext } from "react";
import "../../../styles/Account.scss";
import userApi from "../../../api/userApi.js";
import { AuthContext } from "../../../api/AuthContext.jsx";

const Account = () => {
  const { user, loadProfile } = useContext(AuthContext);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Load dữ liệu từ backend
  useEffect(() => {
    if (!user) return;

    setCustomerName(user.name || ""); // Backend trả về "name"
    setPhone(user.phone || "");
    setEmail(user.email || "");
  }, [user]);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Validate dữ liệu trước khi gửi
  const validateForm = () => {
    const newErrors = {};

    // Tên tiếng Việt
    const nameRegex = /^[\p{L}][\p{L}\s.'-]*[\p{L}]$/u;
    if (!customerName.trim()) {
      newErrors.customerName = "Tên không được để trống";
    } else if (!nameRegex.test(customerName.trim())) {
      newErrors.customerName = "Tên chỉ được chứa chữ cái (hỗ trợ tiếng Việt)";
    }

    // Số điện thoại Việt Nam
    const phoneRegex = /^(0[3|5|7|8|9])\d{8}$/;
    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) return;

    try {
      await userApi.updateProfile({
        customerName: customerName.trim(),
        phone,
        email: email.trim(),
      });

      await loadProfile();
      setNotification({
        show: true,
        message: "Cập nhật thành công!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setNotification({
        show: true,
        message: "Cập nhật thất bại!",
        type: "error",
      });
    }
  };

  return (
    <div className="account">
      <form className="account__form" onSubmit={handleSubmit}>
        {/* CUSTOMER NAME */}
        <div className="form-group">
          <label>Tên người dùng</label>
          <input
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (errors.customerName)
                setErrors({ ...errors, customerName: null });
            }}
          />
          {errors.customerName && (
            <p className="error-text">{errors.customerName}</p>
          )}
        </div>

        {/* PHONE */}
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors({ ...errors, phone: null });
            }}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        {/* EMAIL */}
        <div className="form-group form-group--full">
          <label>Email</label>
          <div className="email-wrapper">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
            />
            <span className="email-status">
              {user?.isVerified ? "Đã xác thực" : "Chưa xác thực"}
            </span>
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="button-container">
          <button className="account__save-btn" type="submit">
            Lưu thay đổi
          </button>

          {/* Notification Toast */}
          {notification.show && (
            <div className={`notification notification--${notification.type}`}>
              <span className="notification__icon">
                {notification.type === "success" ? "✓" : "✕"}
              </span>
              <span className="notification__message">
                {notification.message}
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Account;
