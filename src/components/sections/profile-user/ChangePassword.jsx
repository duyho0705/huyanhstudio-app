import authApi from "../../../api/authApi";
import { useState, useContext } from "react";
import "../../../styles/ChangePassword.scss";
import { AuthContext } from "../../../api/AuthContext";
import LoginModal from "../../layout/LoginModal";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("null");
  const [newPassword, setNewPassword] = useState("null");
  const [confirmedPassword, setConfirmedPassword] = useState("null");
  const [message, setMessage] = useState({ type: "", text: "" });
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
        text: "Mật khẩu mới và xác nhân mật khẩu mới không khớp.",
      });
    }

    try {
      await authApi.changePassword({ oldPassword, newPassword });
      setMessage({
        type: "success",
        text: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
      });
      setTimeout(() => {
        logout(); // yêu cầu login lại
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Đổi mật khẩu thất bại.";
      setMessage({ type: "error", text: msg });
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
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Xác nhận thay đổi
        </button>
      </form>
    </div>
  );
};
export default ChangePassword;
