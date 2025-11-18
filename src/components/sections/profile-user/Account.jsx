import { useRef, useState, useEffect, useContext } from "react";
import "../../../styles/Account.scss";
import userApi from "../../../api/userApi";
import { AuthContext } from "../../../api/AuthContext.jsx";

const Account = () => {
  const { user, loadProfile } = useContext(AuthContext);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const fileRef = useRef();

  // Load dữ liệu từ context vào form
  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setPhone(user.phone || "");
    setEmail(user.email || "");
  }, [user]);

  // Chọn avatar
  const handleChooseAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const openFilePicker = () => {
    fileRef.current?.click();
  };

  // Lưu thay đổi
  const handleSave = async () => {
    if (!user) return alert("Vui lòng đợi tải dữ liệu...");

    try {
      // Nếu có avatar thì gửi FormData
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await userApi.uploadAvatar(formData);
      }

      await userApi.updateProfile({
        name,
        phone,
        email,
      });

      await loadProfile(); // cập nhật lại user từ server

      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="account">
      <h2 className="account__title">Thông tin tài khoản</h2>

      {/* Avatar */}
      <div className="account__avatar-section">
        <div className="account__avatar">
          {avatarPreview ? (
            <img src={avatarPreview} alt="avatar" className="avatar-img" />
          ) : user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
          ) : (
            <span className="avatar-text">
              {(user?.name || "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <button type="button" className="account__avatar-btn" onClick={openFilePicker}>
          Thay đổi ảnh đại diện
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleChooseAvatar}
          hidden
        />
      </div>

      {/* Form */}
      <form className="account__form">
        <div className="form-group">
          <label>Tên người dùng</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Giới tính</label>
          <select defaultValue={user?.gender || "Nam"}>
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ngày sinh</label>
          <input type="date" defaultValue={user?.dob || "1990-01-01"} />
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
