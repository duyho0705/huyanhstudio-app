import authApi from "../../../api/authApi";
import { useState, useContext } from "react";
import { AuthContext } from "../../../api/AuthContext";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

const AdminChangePassword = ({ onClose }) => {
  const { logout } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const showError = (text) => {
    setMessage({ type: "error", text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 2000);
  };

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMessage({ type: "", text: "" });

    if (!oldPassword || !newPassword || !confirmedPassword) {
      return showError("Vui lòng điền đầy đủ thông tin.");
    }
    if (newPassword !== confirmedPassword) {
      return showError("Mật khẩu mới và xác nhận không khớp.");
    }

    try {
      await authApi.changePassword({ oldPassword, newPassword });
      setShowSuccess(true);

      setTimeout(() => {
        logout();
      }, 1500);
    } catch {
      showError("Sai mật khẩu hiện tại.");
    }
  };

  return (
    <div className="relative p-2">
      {message.text && (
        <div className={`fixed top-20 sm:top-24 right-3 sm:right-6 z-[2000] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl border flex items-center gap-3 sm:gap-4 animate-slide-in-right bg-white max-w-[calc(100vw-24px)] sm:max-w-none ${
          message.type === "error" ? "border-red-100 text-slate-900" : "border-blue-100 text-slate-900"
        }`}>
          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
            <AlertCircle size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] sm:text-sm font-bold truncate">{message.type === "error" ? "Lỗi hệ thống" : "Thông báo"}</span>
            <span className="text-[11px] sm:text-xs text-slate-500 truncate">{message.text}</span>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="absolute inset-x-0 -inset-y-4 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl animate-in fade-in duration-300">
          <div className="text-center p-4 sm:p-8 scale-in duration-500">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-green-200">
              <CheckCircle2 size={28} className="sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-1.5 sm:mb-2">Đổi mật khẩu thành công!</h3>
            <p className="text-[13px] sm:text-base text-slate-500 font-medium">Vui lòng đợi trong giây lát...</p>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
            <Lock size={14} className="text-blue-500" />
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
            className="w-full h-10 sm:h-12 px-4 sm:px-5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-[13px] sm:text-base text-slate-900"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
            <Lock size={14} className="text-blue-500" />
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className="w-full h-10 sm:h-12 px-4 sm:px-5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-[13px] sm:text-base text-slate-900"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
            <Lock size={14} className="text-blue-500" />
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            className="w-full h-10 sm:h-12 px-4 sm:px-5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-[13px] sm:text-base text-slate-900"
          />
        </div>

        <button 
            type="submit" 
            className="w-full h-12 sm:h-14 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-[13px] sm:text-sm hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200 mt-2 sm:mt-4 flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          Xác nhận thay đổi
        </button>
      </form>
    </div>
  );
};

export default AdminChangePassword;
