import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiX, FiUser, FiGrid, FiChevronDown, FiLogOut, FiCalendar, FiLock, FiMenu, FiMusic, FiGlobe, FiMic } from "react-icons/fi";
import { FaPlay, FaPause, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import Account from "../features/user/Account";
import BookingProfile from "../features/booking/BookingProfile";
import ChangePassword from "../features/user/ChangePassword";
import useAuthStore from "../../stores/useAuthStore";
import useAppStore from "../../stores/useAppStore";

const NewNavbar = () => {
    const { t, i18n } = useTranslation();
    const { user, loading, logout } = useAuthStore();
    const setShowLoginModal = useAppStore(state => state.setShowLoginModal);
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const navLinkClass = "relative py-1 group transition-all duration-300 whitespace-nowrap";
    const underlineClass = "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#35104C] transition-all duration-300 group-hover:w-full rounded-full";

    const mobileNavLinks = [
        { to: "/products", label: t('common.products') },
        { to: "/services", label: t('common.services') },
        { to: "/booking", label: t('common.booking') },
        { to: "/about", label: t('common.about') },
    ];

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
    };

    const removeVietnameseTones = (str) => {
        if (!str) return "";
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẹ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Combining Diacritical Marks
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
        return str;
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 sm:px-8 py-3 sm:py-3.5 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100" : "bg-transparent"
                }`}>
                <div className="flex items-center justify-between max-w-[1400px] mx-auto relative">
                    {/* Left Column - Desktop nav links */}
                    <div className="flex-1 flex items-center gap-6 sm:gap-8">
                        {/* Hamburger button - Mobile only */}
                        <button
                            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#35104C] hover:bg-black/5 transition-all"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <FiMenu size={22} />
                        </button>

                        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] xl:text-[17px] font-semibold text-[#35104C]">
                            <Link to="/products" className={navLinkClass}>
                                {t('common.products')}
                                <span className={underlineClass}></span>
                            </Link>
                            <Link to="/services" className={navLinkClass}>
                                {t('common.services')}
                                <span className={underlineClass}></span>
                            </Link>
                            <Link to="/booking" className={navLinkClass}>
                                {t('common.booking')}
                                <span className={underlineClass}></span>
                            </Link>
                            <Link to="/about" className={navLinkClass}>
                                {t('common.about')}
                                <span className={underlineClass}></span>
                            </Link>
                            {/* <FiSearch className="text-xl cursor-pointer transition-colors hover:text-[#6CD1FD]" /> */}
                        </div>
                    </div>

                    {/* Logo (Center Column) - Absolute centered to maintain design balance */}
                    <div className="absolute left-1/2 -translate-x-1/2 translate-y-1 z-10 px-4 bg-transparent">
                        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
                            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                                <div className="absolute inset-0 bg-brand-orange rounded-sm rotate-12 transition-transform"></div>
                                <div className="absolute inset-0 bg-[#6CD1FD] rounded-sm -rotate-6 transition-transform"></div>
                                <div className="absolute inset-0 bg-[#35104C] rounded-sm flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold">HA</div>
                            </div>
                            <span className="text-[32px] sm:text-[40px] font-bold tracking-normal text-[#35104C] leading-none" style={{ fontFamily: '"Satisfy", cursive' }}>hastudio</span>
                        </Link>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 flex items-center justify-end gap-4 xl:gap-6">
                        {/* Language Switcher */}
                        <Dropdown
                            menu={{ 
                                items: [
                                    {
                                        key: 'vi',
                                        label: (
                                            <div className="flex items-center gap-3 py-1">
                                                <img 
                                                    src="https://flagcdn.com/w40/vn.png" 
                                                    alt="Vietnamese" 
                                                    className="w-7 h-auto rounded-[3px] shadow-sm border border-gray-100" 
                                                />
                                                <span className="font-medium text-gray-700 text-[14px]">Tiếng Việt</span>
                                            </div>
                                        ),
                                        onClick: () => i18n.changeLanguage('vi'),
                                    },
                                    {
                                        key: 'en',
                                        label: (
                                            <div className="flex items-center gap-3 py-1">
                                                <img 
                                                    src="https://flagcdn.com/w40/us.png" 
                                                    alt="English" 
                                                    className="w-7 h-auto rounded-[3px] shadow-sm border border-gray-100" 
                                                />
                                                <span className="font-medium text-gray-700 text-[14px]">English</span>
                                            </div>
                                        ),
                                        onClick: () => i18n.changeLanguage('en'),
                                    },
                                ] 
                            }}
                            trigger={['click']}
                            placement="bottomRight"
                            overlayClassName="[&_.ant-dropdown-menu]:!p-2 [&_.ant-dropdown-menu-item]:!rounded-xl [&_.ant-dropdown-menu-item]:!px-4 !min-w-[170px]"
                        >
                            <button
                                className="hidden lg:flex items-center justify-center p-0 rounded-xl hover:bg-black/5 transition-all group"
                            >
                                <img 
                                    src={i18n.language === 'vi' ? "https://flagcdn.com/w40/vn.png" : "https://flagcdn.com/w40/us.png"} 
                                    alt="Selected Flag" 
                                    className="w-8 h-auto rounded-[3px] shadow-sm" 
                                />
                            </button>
                        </Dropdown>
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] xl:text-[17px] font-semibold text-[#35104C]">

                            {loading ? (
                                <div className="h-10 w-32 bg-gray-100/50 animate-pulse rounded-xl"></div>
                            ) : !user ? (
                                <div className="flex items-center gap-8">
                                    <button
                                        onClick={() => setShowLoginModal(true, "login")}
                                        className={`${navLinkClass} font-bold`}
                                    >
                                        {t('common.login')}
                                        <span className={underlineClass}></span>
                                    </button>
                                    <button
                                        onClick={() => setShowLoginModal(true, "register")}
                                        className="bg-[#6CD1FD] text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-[#6CD1FD]/20 hover:shadow-xl hover:shadow-[#6CD1FD]/40 active:scale-95 transition-all"
                                    >
                                        {t('common.register')}
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                        className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 bg-white text-[15px] font-semibold text-[#35104C] hover:border-[#6CD1FD] hover:bg-slate-50 transition-all shadow-sm"
                                    >
                                        <FaUserCircle className="text-[#35104C]" size={20} />
                                        <span className="whitespace-nowrap">{t('nav.greeting')}, {i18n.language === 'en' ? removeVietnameseTones(user.customerName || user.email) : (user.customerName || user.email || "bạn")}</span>
                                        <FiChevronDown className={`ml-1 transition-transform ${isDropdownOpen ? "-rotate-180" : ""}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 animate-slide-down origin-top-right">
                                            <button
                                                onClick={() => { setActiveModal("account"); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-[#6CD1FD]/5 hover:text-[#35104C] transition-colors text-left font-semibold"
                                            >
                                                <FiUser size={18} className="text-gray-400" /> {t('nav.profile')}
                                            </button>
                                            <button
                                                onClick={() => { setActiveModal("booking"); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-[#6CD1FD]/5 hover:text-[#35104C] transition-colors text-left font-semibold"
                                            >
                                                <FiCalendar size={18} className="text-gray-400" /> {t('nav.history')}
                                            </button>
                                            <button
                                                onClick={() => { setActiveModal("password"); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-[#6CD1FD]/5 hover:text-[#35104C] transition-colors text-left font-semibold"
                                            >
                                                <FiLock size={18} className="text-gray-400" /> {t('nav.password')}
                                            </button>
                                            <div className="h-px bg-gray-100 my-2"></div>
                                            <button
                                                onMouseDown={(e) => { e.preventDefault(); logout(); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-red-500 hover:bg-red-50 transition-colors text-left font-semibold"
                                            >
                                                <FiLogOut size={18} className="text-red-400" /> {t('nav.logout')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ====== MOBILE SIDEBAR DRAWER ====== */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[300] shadow-2xl flex flex-col"
                        >
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="relative w-7 h-7">
                                        <div className="absolute inset-0 bg-brand-orange rounded-sm rotate-12"></div>
                                        <div className="absolute inset-0 bg-[#6CD1FD] rounded-sm -rotate-6"></div>
                                        <div className="absolute inset-0 bg-[#35104C] rounded-sm flex items-center justify-center text-white text-[9px] font-bold">HA</div>
                                    </div>
                                    <span className="text-[24px] font-bold text-[#35104C]" style={{ fontFamily: '"Satisfy", cursive' }}>hastudio</span>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="space-y-1 px-3">
                                    {mobileNavLinks.map((link, i) => (
                                        <motion.div
                                            key={link.to}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link
                                                to={link.to}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${location.pathname === link.to
                                                    ? "bg-[#6CD1FD]/10 text-[#35104C]"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#35104C]"
                                                    }`}
                                            >
                                                {link.label}
                                                {location.pathname === link.to && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6CD1FD]"></div>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Language Selection in Sidebar */}
                                <div className="px-3 mt-6">
                                    <div className="px-4 py-1 mb-2">
                                        <p className="text-[13px] font-medium text-slate-500">{t('common.language')}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => { i18n.changeLanguage('vi'); setIsMobileMenuOpen(false); }}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${i18n.language === 'vi' ? 'bg-[#6CD1FD]/10 border-[#6CD1FD]/30 text-[#35104C]' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                                        >
                                            <img src="https://flagcdn.com/w80/vn.png" alt="VN" className="w-10 h-auto rounded-md shadow-sm" />
                                            <span className="text-[13px] font-medium">Tiếng Việt</span>
                                        </button>
                                        <button
                                            onClick={() => { i18n.changeLanguage('en'); setIsMobileMenuOpen(false); }}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${i18n.language === 'en' ? 'bg-[#6CD1FD]/10 border-[#6CD1FD]/30 text-[#35104C]' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                                        >
                                            <img src="https://flagcdn.com/w80/us.png" alt="EN" className="w-10 h-auto rounded-md shadow-sm" />
                                            <span className="text-[13px] font-medium">English</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Music Player Toggle in Sidebar */}
                                <div className="px-3 mt-6">
                                    <div className="px-4 py-1 mb-2">
                                        <p className="text-[13px] font-medium text-slate-500">Trải nghiệm</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            // Dispatch a custom event to toggle music in App.jsx
                                            window.dispatchEvent(new CustomEvent('toggleMusic'));
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-gray-600 hover:bg-purple-50 hover:text-[#35104C] transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#35104C] flex items-center justify-center">
                                            <FiMusic size={14} className="text-[#6CD1FD]" />
                                        </div>
                                        Nhạc nền
                                    </button>
                                </div>

                                {/* User Actions in Sidebar */}
                                {user && (
                                    <div className="px-3 mt-6">
                                        <div className="px-4 py-1 mb-2">
                                            <p className="text-[13px] font-medium text-slate-500">Tài khoản</p>
                                        </div>
                                        <button
                                            onClick={() => { setActiveModal("account"); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                                        >
                                            <FiUser size={16} className="text-gray-400" /> {t('user.account.title')}
                                        </button>
                                        <button
                                            onClick={() => { setActiveModal("booking"); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                                        >
                                            <FiCalendar size={16} className="text-gray-400" /> {t('user.booking.title')}
                                        </button>
                                        <button
                                            onClick={() => { setActiveModal("password"); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                                        >
                                            <FiLock size={16} className="text-gray-400" /> {t('user.password.title')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-4 border-t border-gray-100">
                                {loading ? (
                                    <div className="w-full h-20 bg-gray-100 animate-pulse rounded-xl"></div>
                                ) : !user ? (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => { setShowLoginModal(true, "login"); setIsMobileMenuOpen(false); }}
                                            className="w-full py-3 rounded-xl border-2 border-[#35104C] text-[#35104C] font-bold text-[14px] hover:bg-[#35104C] hover:text-white transition-all"
                                        >
                                            {t('common.login')}
                                        </button>
                                        <button
                                            onClick={() => { setShowLoginModal(true, "register"); setIsMobileMenuOpen(false); }}
                                            className="w-full py-3 rounded-xl bg-[#6CD1FD] text-white font-bold text-[14px] shadow-lg active:scale-95 transition-all"
                                        >
                                            {t('common.register')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#6CD1FD]/20 flex items-center justify-center">
                                            <FaUserCircle size={20} className="text-[#35104C]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-bold text-[#35104C] truncate">{i18n.language === 'en' ? removeVietnameseTones(user.customerName || user.email) : (user.customerName || user.email || "Bạn")}</p>
                                            <p className="text-[12px] text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors text-red-400"
                                        >
                                            <FiLogOut size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modals */}
            <Modal
                title={<span className="text-lg font-bold text-[#35104C]">{t('user.account.title')}</span>}
                open={activeModal === "account"}
                onCancel={() => setActiveModal(null)}
                footer={null}
                closable={false}
                width={800}
                centered
                destroyOnHidden
                className="user-profile-modal"
            >
                <div className="pt-4">
                    <Account />
                </div>
            </Modal>

            <Modal
                title={<span className="text-lg font-bold text-[#35104C]">{t('user.booking.title')}</span>}
                open={activeModal === "booking"}
                onCancel={() => setActiveModal(null)}
                footer={null}
                closable={false}
                width={1000}
                centered
                destroyOnHidden
            >
                <div className="pt-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <BookingProfile />
                </div>
            </Modal>

            <Modal
                title={<span className="text-lg font-bold text-[#35104C]">{t('user.password.title')}</span>}
                open={activeModal === "password"}
                onCancel={() => setActiveModal(null)}
                footer={null}
                closable={false}
                width={500}
                centered
                destroyOnHidden
            >
                <div className="pt-4">
                    <ChangePassword />
                </div>
            </Modal>
        </>
    );
};

export default NewNavbar;
