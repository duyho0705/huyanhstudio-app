const fs = require('fs');

const fileVi = 'e:/HoangHuyAnh/huyanhstudio-app/src/locales/vi/translation.json';
const fileEn = 'e:/HoangHuyAnh/huyanhstudio-app/src/locales/en/translation.json';

const updateLocales = () => {
    let vi = JSON.parse(fs.readFileSync(fileVi, 'utf8'));
    let en = JSON.parse(fs.readFileSync(fileEn, 'utf8'));

    vi.translation.admin.dashboard = {
        "morning": "Chào buổi sáng",
        "afternoon": "Chào buổi chiều",
        "evening": "Chào buổi tối",
        "total": "Tổng đặt lịch",
        "pending": "Chờ xác nhận",
        "confirmed": "Đã xác nhận",
        "completed": "Hoàn thành",
        "quick_booking": "Đặt lịch",
        "quick_service": "Dịch vụ",
        "quick_product": "Sản phẩm",
        "quick_user": "Người dùng"
    };

    en.translation.admin.dashboard = {
        "morning": "Good morning",
        "afternoon": "Good afternoon",
        "evening": "Good evening",
        "total": "Total Bookings",
        "pending": "Pending",
        "confirmed": "Confirmed",
        "completed": "Completed",
        "quick_booking": "Booking",
        "quick_service": "Service",
        "quick_product": "Product",
        "quick_user": "User"
    };

    fs.writeFileSync(fileVi, JSON.stringify(vi, null, 2));
    fs.writeFileSync(fileEn, JSON.stringify(en, null, 2));
};

updateLocales();

// Update AdminDashboard.jsx
const dashPath = 'e:/HoangHuyAnh/huyanhstudio-app/src/components/features/admin/AdminDashboard.jsx';
let content = fs.readFileSync(dashPath, 'utf8');

// Add translation hook
if (!content.includes('useTranslation')) {
    content = 'import { useTranslation } from "react-i18next";\n' + content;
}

if (!content.includes('const { t } = useTranslation()')) {
    content = content.replace('const user = useAuthStore(state => state.user);', 'const { t } = useTranslation();\n  const user = useAuthStore(state => state.user);');
}

// Modify greeting logic
content = content.replace(/if \(hour < 12\) return "Chào buổi sáng";/, "if (hour < 12) return t('admin.dashboard.morning');");
content = content.replace(/if \(hour < 18\) return "Chào buổi chiều";/, "if (hour < 18) return t('admin.dashboard.afternoon');");
content = content.replace(/return "Chào buổi tối";/, "return t('admin.dashboard.evening');");

// Modify cards array
content = content.replace(/title: "Tổng đặt lịch"/, "title: t('admin.dashboard.total')");
content = content.replace(/title: "Chờ xác nhận"/, "title: t('admin.dashboard.pending')");
content = content.replace(/title: "Đã xác nhận"/, "title: t('admin.dashboard.confirmed')");
content = content.replace(/title: "Hoàn thành"/, "title: t('admin.dashboard.completed')");

// Modify quick links
content = content.replace(/title: "Đặt lịch"/, "title: t('admin.dashboard.quick_booking')");
content = content.replace(/title: "Dịch vụ"/, "title: t('admin.dashboard.quick_service')");
content = content.replace(/title: "Sản phẩm"/, "title: t('admin.dashboard.quick_product')");
content = content.replace(/title: "Người dùng"/, "title: t('admin.dashboard.quick_user')");

fs.writeFileSync(dashPath, content);
console.log('Fixed translations in AdminDashboard and Locales');
