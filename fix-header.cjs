const fs = require('fs');

const fPath = 'e:/HoangHuyAnh/huyanhstudio-app/src/components/features/admin/components/AdminHeader.jsx';
let content = fs.readFileSync(fPath, 'utf8');

if (!content.includes('useTranslation')) {
    content = 'import { useTranslation } from "react-i18next";\n' + content;
}

if (!content.includes('const { i18n } = useTranslation();')) {
    content = content.replace('const user = useAuthStore(state => state.user);', 'const { t, i18n } = useTranslation();\n  const user = useAuthStore(state => state.user);');
}

// Add Switcher
if (!content.includes("i18n.changeLanguage")) {
    const target = '<button className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-slate-400 rounded-none relative group">';
    const replacement = `
          {/* Language Switcher */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
            className="hidden sm:flex items-center justify-center w-auto px-3 h-9 bg-[#35104C]/5 text-[13px] font-bold text-[#35104C] rounded-xl hover:bg-[#35104C]/10 transition-colors"
          >
            {i18n.language === 'vi' ? 'EN' : 'VI'}
          </button>
          
          <button className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-slate-400 rounded-none relative group">`;
    content = content.replace(target, replacement);
}

// Quick translation of menu items
content = content.replace(/label: <span className="text-\[13px\] sm:text-\[14px\] font-semibold">Hồ sơ cá nhân<\/span>/, 'label: <span className="text-[13px] sm:text-[14px] font-semibold">{t("admin.sidebar.users") || "Hồ sơ cá nhân"}</span>');
content = content.replace(/label: <span className="text-\[13px\] sm:text-\[14px\] font-semibold">Thông báo đặt lịch<\/span>/, 'label: <span className="text-[13px] sm:text-[14px] font-semibold">{t("admin.sidebar.bookings") || "Thông báo đặt lịch"}</span>');
content = content.replace(/label: <span className="text-\[13px\] sm:text-\[14px\] font-semibold text-slate-600">Xem website chính<\/span>/, 'label: <span className="text-[13px] sm:text-[14px] font-semibold text-slate-600">{t("admin.sidebar.returns") || "Xem website chính"}</span>');

fs.writeFileSync(fPath, content);
console.log('Fixed Header');
