import useAuthStore from "../../../stores/useAuthStore";
import useAppStore from "../../../stores/useAppStore";
import authApi from "../../../api/authApi";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const logout = useAuthStore(state => state.logout);

  const submit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!oldPassword || !newPassword || !confirmedPassword) {
      return setMessage({ type: "error", text: t('user.password.errors.fill_all') });
    }
    if (newPassword !== confirmedPassword) {
      return setMessage({ type: "error", text: t('user.password.errors.mismatch') });
    }
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); logout(); }, 1000);
    } catch (err) {
      setMessage({ type: "error", text: t('user.password.errors.wrong_current') });
    }
  };

  const InputField = ({ label, value, onChange, placeholder }) => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
      />
    </div>
  );

  return (
    <div className="max-w-md">
      {message.text && (
        <p className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
          }`}>
          {message.text}
        </p>
      )}

      <form onSubmit={submit}>
        <InputField label={t('user.password.current')} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder={t('user.password.placeholders.current')} />
        <InputField label={t('user.password.new')} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t('user.password.placeholders.new')} />
        <InputField label={t('user.password.confirm')} value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} placeholder={t('user.password.placeholders.confirm')} />

        <button type="submit" className="px-8 w-full py-3 text-[14px] font-semibold text-white bg-[#35104C] rounded-xl shadow-lg shadow-[#35104C]/20 transition-all mt-4">
          {t('user.password.submit')}
        </button>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-slide-up">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-3xl mb-4">✓</span>
            <p className="text-lg font-bold text-gray-900">{t('user.password.success')}</p>
            <small className="text-sm text-gray-500">{t('user.password.relogin')}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
