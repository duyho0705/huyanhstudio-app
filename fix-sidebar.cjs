const fs = require('fs');

const filePath = 'e:/HoangHuyAnh/huyanhstudio-app/src/components/features/admin/components/AdminSidebar.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix imports
content = content.replace(/import \{ useTranslation \} from "react-i18next";\r?\nimport \{ useTranslation \} from "react-i18next";/, 'import { useTranslation } from "react-i18next";');
content = content.replace('import { useContext } from "react";', '');

// Add { t } hook if not exists
if (!content.includes('const { t } = useTranslation();')) {
    content = content.replace('const logout = useAuthStore(state => state.logout);', 'const { t } = useTranslation();\n  const logout = useAuthStore(state => state.logout);');
}

// Replace labels
content = content.replace(/label: "Bảng điều khiển"/g, "label: t('admin.sidebar.dashboard')");
content = content.replace(/label: "Tin nhắn"/g, "label: t('admin.sidebar.chat')");
content = content.replace(/label: "Lịch thu âm"/g, "label: t('admin.sidebar.bookings')");
content = content.replace(/label: "Kho sản phẩm"/g, "label: t('admin.sidebar.products')");
content = content.replace(/label: "Gói dịch vụ"/g, "label: t('admin.sidebar.services')");
content = content.replace(/label: "Người dùng"/g, "label: t('admin.sidebar.users')");
content = content.replace(/<span>Đăng xuất<\/span>/g, "<span>{t('admin.sidebar.returns')}</span>");

fs.writeFileSync(filePath, content);
console.log('Fixed translations in AdminSidebar');
