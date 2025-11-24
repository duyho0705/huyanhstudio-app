import React, { useState, useContext } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import authApi from "../../../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../api/AuthContext";
import "../../../styles/Login.scss";

const Login = ({ onClose }) => {
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const showError = (text) => {
    setMessage({
      type: "error",
      text,
    });

    // Tự ẩn message sau 2 giây
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!username || !password) {
      showError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.login({ username, password });

      const { accessToken, refreshToken, user } = data;
      if (!accessToken || !refreshToken) {
        showError("Lỗi hệ thống. Vui lòng thử lại sau.");
        return;
      }

      loginContext({
        accessToken,
        refreshToken,
      });

      setMessage({ type: "success", text: "✓ Đăng nhập thành công!" });

      setTimeout(() => {
        onClose?.();
      }, 500);
    } catch (err) {
      const status = err.response?.status;

      switch (status) {
        case 400:
          showError("Thông tin đăng nhập không hợp lệ.");
          break;
        case 401:
          showError("Sai tên đăng nhập hoặc mật khẩu.");
          break;
        default:
          showError("Lỗi hệ thống. Vui lòng thử lại sau.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const phone = e.target.phone.value.trim();
    const fullName = e.target.fullName.value.trim();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    if (!phone || !fullName || !username || !password || !confirmPassword) {
      showError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      // Gửi register
      await authApi.register({ phone, fullName, username, password });
      setMessage({ type: "success", text: "✓ Đăng ký thành công!" });
      // Đăng nhập luôn sau khi đăng ký
      const loginRes = await authApi.login({ username, password });
      loginContext({
        accessToken: loginRes.accessToken,
        refreshToken: loginRes.refreshToken,
      });

      setTimeout(() => {
        onClose?.();
      }, 700);

      navigate("/"); // Về home
    } catch (err) {
      showError("Thông tin không hợp lệ.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__card">
      {message.text && (
        <div className={`auth__message auth__message--${message.type}`}>
          {message.text}
        </div>
      )}

      {isLogin ? (
        <>
          <h2 className="auth__title">Đăng nhập</h2>

          <form className="auth__form" onSubmit={handleLogin}>
            <div className="form__group">
              <label className="form__label">Tên đăng nhập</label>
              <input name="username" type="text" className="form__input" />
            </div>

            <div className="form__group">
              <label className="form__label">Mật khẩu</label>
              <input type="password" name="password" className="form__input" />
            </div>

            <button className="form__button">Đăng nhập</button>
          </form>

          <div className="auth__divider">
            <div className="auth__divider-line"></div>
            <span className="auth__divider-text">Hoặc</span>
            <div className="auth__divider-line"></div>
          </div>

          <div className="auth__socials">
            <button className="social__button facebook">
              <FaFacebookF className="social__icon" /> Facebook
            </button>
            <button className="social__button google">
              <FcGoogle className="social__icon" /> Google
            </button>
          </div>

          <div className="auth__switch">
            <span className="auth__switch-text">Chưa có tài khoản? </span>
            <button
              type="button"
              className="auth__switch-link"
              onClick={() => setIsLogin(false)}
            >
              Đăng ký
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="auth__title">Đăng ký</h2>

          <form className="auth__form" onSubmit={handleSignup}>
            <div className="form__group">
              <label className="form__label">Số điện thoại</label>
              <input type="text" name="phone" className="form__input" />
            </div>
            <div className="form__group">
              <label className="form__label">Tên hiển thị</label>
              <input type="text" name="fullName" className="form__input" />
            </div>
            <div className="form__group">
              <label className="form__label">Tên đăng nhập</label>
              <input type="text" name="username" className="form__input" />
            </div>

            <div className="form__group">
              <label className="form__label">Mật khẩu</label>
              <input type="password" name="password" className="form__input" />
            </div>

            <div className="form__group">
              <label className="form__label">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                className="form__input"
              />
            </div>

            <button className="form__button">Tạo tài khoản</button>
          </form>

          <div className="auth__divider">
            <div className="auth__divider-line"></div>
            <span className="auth__divider-text">Hoặc</span>
            <div className="auth__divider-line"></div>
          </div>

          <div className="auth__socials">
            <button className="social__button facebook">
              <FaFacebookF className="social__icon" /> Facebook
            </button>
            <button className="social__button google">
              <FcGoogle className="social__icon" /> Google
            </button>
          </div>

          <div className="auth__switch">
            <span className="auth__switch-text">Đã có tài khoản? </span>
            <button
              type="button"
              className="auth__switch-link"
              onClick={() => setIsLogin(true)}
            >
              Đăng nhập
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
