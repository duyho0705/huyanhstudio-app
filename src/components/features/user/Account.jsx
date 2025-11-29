import { useState, useEffect, useContext } from "react";
import "../../../styles/Account.scss";
import userApi from "../../../api/userApi.js";
import { AuthContext } from "../../../api/AuthContext.jsx";

const Account = () => {
  const { user, loadProfile } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Load dữ liệu vào form
  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setPhone(user.phone || "");
    setEmail(user.email || "");
  }, [user]);

  // Lưu thay đổi
  const handleSave = async () => {
    if (!user) return alert("Vui lòng đợi tải dữ liệu...");

    try {
      await userApi.updateProfile({
        name,
        phone,
        email,
      });

      await loadProfile();

      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="account">
      <h2 className="account__title">Thông tin tài khoản</h2>

      <form className="account__form">
        <div className="form-group">
          <label>Tên người dùng</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="form-group form-group--full">
          <label>Email</label>
          <div className="email-wrapper">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="email-status">
              {user?.isVerified ? "Đã xác thực" : "Chưa xác thực"}
            </span>
          </div>
        </div>
      </form>

      <button className="account__save-btn" onClick={handleSave}>
        Lưu thay đổi
      </button>
    </div>
  );
};

export default Account;
