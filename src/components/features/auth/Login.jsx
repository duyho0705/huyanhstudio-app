import React, { useState, useContext } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiX, FiMail, FiLock, FiPhone, FiUser, FiArrowRight, FiEye, FiEyeOff, FiShield, FiKey } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import authApi from "../../../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../api/AuthContext";
import userApi from "../../../api/userApi";
import { auth, googleProvider, facebookProvider } from "../../../api/firebase";
import { signInWithPopup } from "firebase/auth";

const InputField = ({ label, name, type = "text", icon: Icon, error, value, onChange, ...props }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-5 relative">
      <div className="flex justify-between items-end mb-1.5 ml-1">
        <label className="block text-[15px] font-semibold text-[#35104C]/70">{label}</label>
      </div>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? "text-red-400" : "text-gray-400 group-focus-within:text-[#6CD1FD]"}`}>
          <Icon size={18} />
        </div>
        <input
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 ${isPassword ? "pr-12" : "pr-4"} py-3 border rounded-[18px] text-[15px] text-[#35104C] outline-none transition-all placeholder:text-gray-300 ${error
            ? "bg-[#FEF2F2] border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-400/5"
            : "bg-[#F8F9FB] border-gray-200 focus:border-[#6CD1FD]/40 focus:ring-4 focus:ring-[#6CD1FD]/5"
            }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6CD1FD] transition-colors"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

const Login = ({ onClose, initialMode = "login" }) => {
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);

  // Cập nhật chế độ khi giá trị prop thay đổi
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

      // Kiểm tra role để chuyển hướng
      const roles = Array.isArray(userData?.roles) ? userData.roles : [];
      if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_STAFF")) {
        navigate("/admin");
      }
    } catch (err) {
      showError("Tên đăng nhập hoặc mật khẩu không chính xác.");
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
      setMessage({ type: "success", text: "✓ Chúc mừng! Đăng ký tài khoản thành công." });

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
    <div className="relative w-full max-w-[500px] bg-white rounded-[24px] shadow-[0_40px_100px_rgba(108,209,253,0.12),0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-white/50 ring-1 ring-black/[0.02]">
      {/* Background Decor - Brighter and more vibrant */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#6CD1FD]/20 rounded-full blur-[80px] -mr-24 -mt-24 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-[100px]"></div>

      <div className="p-7 md:p-9 relative z-10 transition-all">
        {/* Header Section - Centered */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 bg-brand-orange rounded-sm rotate-12 opacity-80"></div>
                <div className="absolute inset-0 bg-[#6CD1FD] rounded-sm -rotate-6"></div>
                <div className="absolute inset-0 bg-[#35104C] rounded-sm flex items-center justify-center text-white text-[9px] font-bold">HA</div>
              </div>
              <span className="text-[26px] font-bold text-[#35104C]" style={{ fontFamily: '"Satisfy", cursive' }}>hastudio</span>
            </div>
          </div>
        </div>

        {/* Form Message */}
        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`mb-6 px-5 py-4 rounded-[14px] text-[15px] font-semibold flex items-center gap-3 shadow-sm ${message.type === "error"
                ? "bg-red-50 text-black border border-red-100"
                : "bg-green-50 text-black border border-green-100"
                }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${message.type === "error" ? "bg-red-500" : "bg-green-500"}`}></div>
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forms with Animation */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
              >
                <InputField
                  label="Tên tài khoản"
                  name="username"
                  placeholder="Nhập tên tài khoản"
                  icon={FiUser}
                  error={errors.username}
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  icon={FiLock}
                  error={errors.password}
                  value={formData.password}
                  onChange={handleInputChange}
                />

                <div className="flex justify-end mb-5">
                  <button type="button" className="text-[13px] font-semibold text-[#6CD1FD]/70 hover:text-[#6CD1FD] transition-colors">
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  disabled={loading}
                  className="w-full py-3.5 bg-[#6CD1FD] text-white font-bold rounded-full shadow-lg shadow-[#6CD1FD]/20 hover:shadow-[#6CD1FD]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 normal-case tracking-normal"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSignup}
              >
                <InputField
                  label="Tên người dùng"
                  name="fullName"
                  placeholder="Nhập tên người dùng"
                  icon={FiUser}
                  error={errors.fullName}
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Số điện thoại"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  icon={FiPhone}
                  error={errors.phone}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Tên tài khoản"
                  name="username"
                  placeholder="Nhập tên tài khoản"
                  icon={FiMail}
                  error={errors.username}
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  icon={FiLock}
                  error={errors.password}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  icon={FiKey}
                  error={errors.confirmPassword}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />

                <button
                  disabled={loading}
                  className="w-full py-3.5 bg-[#35104C] text-white font-bold rounded-full shadow-lg shadow-[#35104C]/20 hover:shadow-[#35104C]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 normal-case tracking-normal"
                >
                  {loading ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-[1px] bg-gray-100"></div>
          <span className="text-[15px] text-slate-700 font-medium">Hoặc tiếp tục với</span>
          <div className="flex-1 h-[1px] bg-gray-100"></div>
        </div>

        {/* Social Logins - Minimalist Icon Only */}
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={() => handleSocialLogin(googleProvider)}
            className="w-14 h-14 flex items-center justify-center rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200 transition-all active:scale-90"
            title="Đăng nhập Google"
          >
            <FcGoogle size={28} />
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin(facebookProvider)}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#1877F2] text-white hover:bg-[#166fe5] hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-90"
            title="Đăng nhập Facebook"
          >
            <FaFacebookF size={24} />
          </button>
        </div>

        {/* Switch State */}
        <div className="text-center mt-6">
          <p className="text-[14px] text-slate-500 font-medium">
            {isLogin ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản chưa ?"}{" "}
            <button
              type="button"
              className="text-[#6CD1FD]/80 font-semibold hover:text-[#6CD1FD] transition-all hover:underline bg-transparent border-none cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Tạo tài khoản" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
