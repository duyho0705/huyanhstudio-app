import authApi from "../../../api/authApi";
import { useState, useContext } from "react";
import "../../../styles/ChangePassword.scss";
import { AuthContext } from "../../../api/AuthContext";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const { logout } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!oldPassword || !newPassword || !confirmedPassword) {
      return setMessage({
        type: "error",
        text: "Vui lòng điền đầy đủ thông tin.",
      });
    }
    if (newPassword !== confirmedPassword) {
      return setMessage({
        type: "error",
        text: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
      });
    }

    try {
      await authApi.changePassword({ oldPassword, newPassword });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        logout();
      }, 1500);
    } catch (err) {
      const msg = "Sai mật khẩu hiện tại.";
      setMessage({
        type: "error",
        text: msg,
      });
    }
  };
  return (
    <div className="change-password">
      <h2>Đổi mật khẩu</h2>

      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}

      <form onSubmit={submit}>
        <div className="form-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <button type="submit" className="submit-btn">
          Xác nhận thay đổi
        </button>
      </form>

      {showSuccess && (
        <div className="success-modal">
          <div className="success-card">
            <span className="icon">✓</span>
            <p>Đổi mật khẩu thành công!</p>
            <small>Vui lòng đăng nhập lại</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
