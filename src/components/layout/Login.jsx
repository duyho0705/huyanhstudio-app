import React, { useState } from "react";
import "./Login.scss";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setTimeout(() => {
      setMessage({ type: "success", text: "✓ Đăng nhập thành công!" });
    }, 800);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!name || !email || password.length < 6) {
      setMessage({ type: "error", text: "✗ Vui lòng kiểm tra lại thông tin!" });
      return;
    }

    setTimeout(() => {
      setMessage({ type: "success", text: "✓ Đăng ký thành công!" });
    }, 800);
  };

  return (
      <div className="auth__card">
        {message.text && (
          <div
            className={`auth__message auth__message--${message.type}`}
          >
            {message.text}
          </div>
        )}

        {isLogin ? (
          <>
            <h2 className="auth__title">Đăng nhập</h2>
            <form className="auth__form" onSubmit={handleLogin}>
              <div className="form__group">
                <label className="form__label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form__input"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="form__group">
                <label className="form__label">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  className="form__input"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button className="form__button">Đăng nhập</button>
            </form>

            <div className="auth__divider">
              <div className="auth__divider-line"></div>
              <span className="auth__divider-text">Hoặc</span>
              <div className="auth__divider-line"></div>
            </div>

            <div className="auth__socials">
              <button className="social__button">
                <span className="social__icon">📘</span> Facebook
              </button>
              <button className="social__button">
                <span className="social__icon">🔍</span> Google
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
                <label className="form__label">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  className="form__input"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div className="form__group">
                <label className="form__label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form__input"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="form__group">
                <label className="form__label">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  className="form__input"
                  placeholder="••••••••"
                  required
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
              <button className="social__button">
                <span className="social__icon">📘</span> Facebook
              </button>
              <button className="social__button">
                <span className="social__icon">🔍</span> Google
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
