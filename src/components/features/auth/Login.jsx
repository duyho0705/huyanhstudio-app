import React, { useState, useContext } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import authApi from "../../../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../api/AuthContext";

const Login = ({ onClose }) => {
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const showError = (text) => {
    setMessage({ type: "error", text });
    setTimeout(() => setMessage({ type: "", text: "" }), 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    if (!username || !password) { showError("Vui lòng nhập tên đăng nhập và mật khẩu."); return; }
    setLoading(true);
    try {
      const data = await authApi.login({ username, password });
      const { accessToken, refreshToken } = data;
      if (!accessToken || !refreshToken) { showError("Lỗi hệ thống. Vui lòng thử lại sau."); return; }
      loginContext({ accessToken, refreshToken });
      setMessage({ type: "success", text: "✓ Đăng nhập thành công!" });
      setTimeout(() => onClose?.(), 500);
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) showError("Thông tin đăng nhập không hợp lệ.");
      else if (status === 401) showError("Sai tên đăng nhập hoặc mật khẩu.");
      else showError("Lỗi hệ thống. Vui lòng thử lại sau.");
    } finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    const phone = e.target.phone.value.trim();
    const fullName = e.target.fullName.value.trim();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();
    if (!phone || !fullName || !username || !password || !confirmPassword) { showError("Vui lòng nhập đầy đủ thông tin."); return; }
    if (password !== confirmPassword) { showError("Mật khẩu xác nhận không khớp."); return; }
    setLoading(true);
    try {
      await authApi.register({ phone, fullName, username, password });
      setMessage({ type: "success", text: "✓ Đăng ký thành công!" });
      const loginRes = await authApi.login({ username, password });
      loginContext({ accessToken: loginRes.accessToken, refreshToken: loginRes.refreshToken });
      setTimeout(() => onClose?.(), 700);
      navigate("/");
    } catch (err) { showError("Thông tin không hợp lệ."); }
    finally { setLoading(false); }
  };

  const InputField = ({ label, name, type = "text", ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 focus:bg-white"
        {...props}
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
      {message.text && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in ${
          message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
        }`}>
          {message.text}
        </div>
      )}

      {isLogin ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            <InputField label="Tên đăng nhập" name="username" />
            <InputField label="Mật khẩu" name="password" type="password" />
            <button className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold rounded-xl shadow-md shadow-blue-200 hover:opacity-90 transition-all text-sm mt-2">
              Đăng nhập
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">Hoặc</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <FaFacebookF className="text-blue-600" /> Facebook
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <FcGoogle /> Google
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <button type="button" className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer" onClick={() => setIsLogin(false)}>
              Đăng ký
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đăng ký</h2>
          <form onSubmit={handleSignup}>
            <InputField label="Số điện thoại" name="phone" />
            <InputField label="Tên hiển thị" name="fullName" />
            <InputField label="Tên đăng nhập" name="username" />
            <InputField label="Mật khẩu" name="password" type="password" />
            <InputField label="Xác nhận mật khẩu" name="confirmPassword" type="password" />
            <button className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold rounded-xl shadow-md shadow-blue-200 hover:opacity-90 transition-all text-sm mt-2">
              Tạo tài khoản
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">Hoặc</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <FaFacebookF className="text-blue-600" /> Facebook
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <FcGoogle /> Google
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <button type="button" className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer" onClick={() => setIsLogin(true)}>
              Đăng nhập
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
