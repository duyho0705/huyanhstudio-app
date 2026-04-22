import React, { useState, useEffect } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import authApi from "../../../api/authApi";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/useAuthStore";
import { auth, googleProvider, facebookProvider } from "../../../api/firebase";
import { signInWithPopup } from "firebase/auth";

const Login = ({ onClose, initialMode = "login" }) => {
  const loginContext = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  React.useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (!value && name !== "confirmPassword") {
      error = "Không được để trống";
    } else if (name === "phone") {
      const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(value)) error = "SĐT không hợp lệ";
    } else if (name === "username" && value.length < 4) {
      error = "Tối thiểu 4 ký tự";
    } else if (name === "password" && value.length < 6) {
      error = "Tối thiểu 6 ký tự";
    } else if (name === "confirmPassword" && value !== formData.password) {
      error = "Mật khẩu không khớp";
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const showError = (text) => {
    setMessage({ type: "error", text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    ["username", "password"].forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login({ username: formData.username, password: formData.password });
      const { accessToken } = data;
      const userData = await loginContext({ accessToken });

      onClose?.();

      const roles = Array.isArray(userData?.roles) ? userData.roles : [];
      if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_STAFF")) {
        navigate("/admin");
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        showError("Server phản hồi chậm, vui lòng thử lại sau giây lát.");
      } else if (err.response?.status === 401) {
        showError("Tên đăng nhập hoặc mật khẩu không chính xác.");
      } else {
        showError("Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.");
      }
    } finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};
    ["phone", "fullName", "username", "password", "confirmPassword"].forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        phone: formData.phone,
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password
      });
      setMessage({ type: "success", text: "Đăng ký thành công! Đang đăng nhập..." });

      const loginRes = await authApi.login({ username: formData.username, password: formData.password });
      loginContext({ accessToken: loginRes.accessToken });

      onClose?.();
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Thông tin đã tồn tại hoặc không hợp lệ.";
      showError(errorMsg);
    } finally { setLoading(false); }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const data = await authApi.loginWithFirebase(idToken);
      const { accessToken } = data;
      const userData = await loginContext({ accessToken });

      onClose?.();

      const roles = Array.isArray(userData?.roles) ? userData.roles : [];
      if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_STAFF")) {
        navigate("/admin");
      }
    } catch (err) {
      console.error("Social login error:", err);
      showError("Đăng nhập mạng xã hội thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full mx-auto max-w-[340px] md:max-w-[480px] bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">

      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 shadow-sm transition-all"
      >
        <FiX size={18} />
      </button>

      <div className="p-4 sm:p-8 sm:pt-7 overflow-y-auto custom-scrollbar flex-1">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <div className="absolute inset-0 bg-brand-orange rounded-sm rotate-12 opacity-80"></div>
            <div className="absolute inset-0 bg-[#6CD1FD] rounded-sm -rotate-6"></div>
            <div className="absolute inset-0 bg-[#35104C] rounded-sm flex items-center justify-center text-white text-[7px] sm:text-[8px] font-bold">HA</div>
          </div>
          <span className="text-base sm:text-lg font-bold text-[#35104C]" style={{ fontFamily: '"Satisfy", cursive' }}>hastudio</span>
        </div>

        {/* Title */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-[18px] sm:text-[24px] font-bold text-gray-900 tracking-tight">
            {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </h2>
          <p className="text-[12px] sm:text-[14px] text-gray-500 mt-0.5 sm:mt-1">
            {isLogin
              ? "Chào mừng bạn quay trở lại"
              : "Bắt đầu trải nghiệm cùng hastudio"}
          </p>
        </div>

        {/* Message */}
        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-5 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "error"
                ? "bg-red-50 text-red-700 border border-red-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Login - Đặt lên trên */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => handleSocialLogin(googleProvider)}
            className="flex-1 h-9 sm:h-11 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-[12px] sm:text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <FcGoogle size={16} sm:size={20} />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin(facebookProvider)}
            className="flex-1 h-9 sm:h-11 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#1877F2] text-[12px] sm:text-[14px] font-medium text-white hover:bg-[#1565d8] transition-all active:scale-[0.98]"
          >
            <FaFacebookF size={13} sm:size={16} />
            <span>Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-[14px] text-gray-400 font-medium">hoặc</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login-form"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
            >
              {/* Username */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[12px] sm:text-[13px] font-medium sm:font-semibold text-gray-700 mb-1 sm:mb-1.5">Tên tài khoản</label>
                <div className="relative">
                  <input
                    name="username"
                    type="text"
                    placeholder="Nhập tên tài khoản"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-9 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[12px] sm:text-[14px] text-gray-900 outline-none transition-all placeholder:text-gray-400 ${errors.username
                      ? "border border-red-300 bg-red-50/50 focus:border-red-400"
                      : "border border-gray-200 bg-white focus:border-[#35104C] focus:ring-1 focus:ring-[#35104C]/10"
                      }`}
                  />
                </div>
                {errors.username && <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 sm:mt-1.5 ml-1">{errors.username}</p>}
              </div>

              {/* Password */}
              <div className="mb-3 sm:mb-5">
                <div className="flex justify-between items-center mb-1 sm:mb-1.5">
                  <label className="block text-[12px] sm:text-[13px] font-medium sm:font-semibold text-gray-700">Mật khẩu</label>
                  <button type="button" className="text-[10px] sm:text-[11px] text-[#35104C]/60 sm:text-[#35104C]/70 hover:text-[#35104C] transition-colors font-medium sm:font-bold">
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-9 sm:h-11 px-3 sm:px-4 pr-9 sm:pr-10 rounded-lg sm:rounded-xl text-[12px] sm:text-[14px] text-gray-900 outline-none transition-all placeholder:text-gray-400 ${errors.password
                      ? "border border-red-300 bg-red-50/50 focus:border-red-400"
                      : "border border-gray-200 bg-white focus:border-[#35104C] focus:ring-1 focus:ring-[#35104C]/10"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={14} sm:size={16} /> : <FiEye size={14} sm:size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 sm:mt-1.5 ml-1">{errors.password}</p>}
              </div>

              <button
                disabled={loading}
                className="w-full h-9 sm:h-11 mt-1.5 sm:mt-2 bg-[#35104C] text-white text-[12px] sm:text-[14px] font-semibold sm:font-bold rounded-lg sm:rounded-xl hover:bg-[#2a0d3d] transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup-form"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSignup}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                {/* Full Name */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-[12px] sm:text-[13px] font-medium sm:font-semibold text-gray-700 mb-1 sm:mb-1.5">Họ và tên</label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full h-9 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[12px] sm:text-[14px] text-gray-900 outline-none transition-all placeholder:text-gray-400 ${errors.fullName
                      ? "border border-red-300 bg-red-50/50"
                      : "border border-gray-200 bg-white focus:border-[#35104C] focus:ring-1 focus:ring-[#35104C]/10"
                      }`}
                  />
                  {errors.fullName && <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 sm:mt-1.5 ml-1">{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-[12px] sm:text-[13px] font-medium sm:font-semibold text-gray-700 mb-1 sm:mb-1.5">Số điện thoại</label>
                  <input
                    name="phone"
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full h-9 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[12px] sm:text-[14px] text-gray-900 outline-none transition-all placeholder:text-gray-400 ${errors.phone
                      ? "border border-red-300 bg-red-50/50"
                      : "border border-gray-200 bg-white focus:border-[#35104C] focus:ring-1 focus:ring-[#35104C]/10"
                      }`}
                  />
                  {errors.phone && <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 sm:mt-1.5 ml-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Username */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[12px] sm:text-[13px] font-medium sm:font-semibold text-gray-700 mb-1 sm:mb-1.5">Tên tài khoản</label>
                <input
                  name="username"
                  type="text"
                  placeholder="Nhập tên tài khoản"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full h-9 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[12px] sm:text-[14px] text-gray-900 outline-none transition-all placeholder:text-gray-400 ${errors.username
                    ? "border border-red-300 bg-red-50/50"
                    : "border border-gray-200 bg-white focus:border-[#35104C] focus:ring-1 focus:ring-[#35104C]/10"
                    }`}
                />
                {errors.username && <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 sm:mt-1.5 ml-1">{errors.username}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                {/* Password */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-[12px] sm:text-[13px] font-medium sm:font-semibold text-gray-700 mb-1 sm:mb-1.5">Mật khẩu</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tối thiểu 6 ký tự"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full h-9 sm:h-11 px-3 sm:px-4 pr-9 sm:pr-10 rounded-lg sm:rounded-xl text-[12px] sm:text-[14px] text-gray-900 outline-none transition-all placeholder:text-gray-400 ${errors.password
                        ? "border border-red-300 bg-red-50/50"
                        : "border border-gray-200 bg-white focus:border-[#35104C] focus:ring-1 focus:ring-[#35104C]/10"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={14} sm:size={16} /> : <FiEye size={14} sm:size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 sm:mt-1.5 ml-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="mb-3 sm:mb-5">
                  <label className="block text-[12px] sm:text-[13px] font-medium sm:font-semibold text-gray-700 mb-1 sm:mb-1.5">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full h-9 sm:h-11 px-3 sm:px-4 pr-9 sm:pr-10 rounded-lg sm:rounded-xl text-[12px] sm:text-[14px] text-gray-900 outline-none transition-all placeholder:text-gray-400 ${errors.confirmPassword
                        ? "border border-red-300 bg-red-50/50"
                        : "border border-gray-200 bg-white focus:border-[#35104C] focus:ring-1 focus:ring-[#35104C]/10"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <FiEyeOff size={14} sm:size={16} /> : <FiEye size={14} sm:size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 sm:mt-1.5 ml-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full h-9 sm:h-11 mt-1 bg-[#35104C] text-white text-[12px] sm:text-[14px] font-semibold sm:font-bold rounded-lg sm:rounded-xl hover:bg-[#2a0d3d] transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Switch */}
        <p className="text-center text-sm sm:text-[14px] text-gray-500 mt-6 sm:mt-8">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            type="button"
            className="text-[#35104C] font-semibold sm:font-bold hover:underline bg-transparent border-none cursor-pointer"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setMessage({ type: "", text: "" });
            }}
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
