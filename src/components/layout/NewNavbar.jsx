import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiX, FiUser, FiGrid, FiChevronDown, FiLogOut, FiCalendar, FiLock, FiMenu, FiMusic } from "react-icons/fi";
import { FaPlay, FaPause } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../api/AuthContext";
import { Modal } from "antd";
import Account from "../features/user/Account";
import BookingProfile from "../features/booking/BookingProfile";
import ChangePassword from "../features/user/ChangePassword";

const NewNavbar = () => {
    const { user, setShowLoginModal, logout } = useContext(AuthContext);
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

    const navLinkClass = "relative py-1 group transition-all duration-300";
    const underlineClass = "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#35104C] transition-all duration-300 group-hover:w-full rounded-full";

    const mobileNavLinks = [
        { to: "/products", label: "Sản phẩm" },
        { to: "/services", label: "Dịch vụ & Bảng giá" },
        { to: "/booking", label: "Đặt lịch" },
        { to: "/about", label: "Về chúng tôi" },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 sm:px-8 py-3 sm:py-3.5 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100" : "bg-transparent"
                }`}>
                <div className="grid grid-cols-3 items-center max-w-[1400px] mx-auto">
                    {/* Left Column - Desktop nav links */}
                    <div className="flex items-center gap-10">
                        {/* Hamburger button - Mobile only */}
                        <button
                            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#35104C] hover:bg-black/5 transition-all"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <FiMenu size={22} />
                        </button>

                        <div className="hidden lg:flex items-center gap-8 text-[17px] font-semibold text-[#35104C]">
                            <Link to="/products" className={navLinkClass}>
                                Sản phẩm
                                <span className={underlineClass}></span>
                            </Link>
                            <Link to="/services" className={navLinkClass}>
                                Dịch vụ & Bảng giá
                                <span className={underlineClass}></span>
                            </Link>
                            <Link to="/booking" className={navLinkClass}>
                                Đặt lịch
                                <span className={underlineClass}></span>
                            </Link>
                            <FiSearch className="text-xl cursor-pointer transition-colors hover:text-[#6CD1FD]" />
                        </div>
                    </div>

                    {/* Logo (Center Column) */}
                    <div className="flex justify-center translate-y-1">
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
                    <div className="flex items-center justify-end gap-8">
                        <div className="hidden lg:flex items-center gap-8 text-[17px] font-semibold text-[#35104C]">
                            <Link to="/about" className={navLinkClass}>
                                Về chúng tôi
                                <span className={underlineClass}></span>
                            </Link>
                            {!user ? (
                                <div className="flex items-center gap-8">
                                    <button
                                        onClick={() => setShowLoginModal(true, "login")}
                                        className={`${navLinkClass} font-bold`}
                                    >
                                        Đăng nhập
                                        <span className={underlineClass}></span>
                                    </button>
                                    <button
                                        onClick={() => setShowLoginModal(true, "register")}
                                        className="bg-[#6CD1FD] text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-[#6CD1FD]/20 hover:shadow-xl hover:shadow-[#6CD1FD]/40 active:scale-95 transition-all"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                        className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 bg-white text-[15px] font-semibold text-[#35104C] hover:border-[#6CD1FD] hover:bg-slate-50 transition-all shadow-sm"
                                    >
                                        <FiUser className="text-[#6CD1FD]" size={18} />
                                        <span className="whitespace-nowrap">Xin chào, {user.customerName || user.email || "bạn"}</span>
                                        <FiChevronDown className={`ml-1 transition-transform ${isDropdownOpen ? "-rotate-180" : ""}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 animate-slide-down origin-top-right">
                                            <button
                                                onClick={() => { setActiveModal("account"); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-[#6CD1FD]/5 hover:text-[#35104C] transition-colors text-left font-semibold"
                                            >
                                                <FiUser size={18} className="text-gray-400" /> Thông tin cá nhân
                                            </button>
                                            <button
                                                onClick={() => { setActiveModal("booking"); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-[#6CD1FD]/5 hover:text-[#35104C] transition-colors text-left font-semibold"
                                            >
                                                <FiCalendar size={18} className="text-gray-400" /> Lịch sử đặt lịch
                                            </button>
                                            <button
                                                onClick={() => { setActiveModal("password"); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-[#6CD1FD]/5 hover:text-[#35104C] transition-colors text-left font-semibold"
                                            >
                                                <FiLock size={18} className="text-gray-400" /> Đổi mật khẩu
                                            </button>
                                            <div className="h-px bg-gray-100 my-2"></div>
                                            <button
                                                onMouseDown={(e) => { e.preventDefault(); logout(); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-red-500 hover:bg-red-50 transition-colors text-left font-semibold"
                                            >
                                                <FiLogOut size={18} className="text-red-400" /> Đăng xuất
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
                                            <FiUser size={16} className="text-gray-400" /> Thông tin cá nhân
                                        </button>
                                        <button
                                            onClick={() => { setActiveModal("booking"); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                                        >
                                            <FiCalendar size={16} className="text-gray-400" /> Lịch sử đặt lịch
                                        </button>
                                        <button
                                            onClick={() => { setActiveModal("password"); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                                        >
                                            <FiLock size={16} className="text-gray-400" /> Đổi mật khẩu
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-4 border-t border-gray-100">
                                {!user ? (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => { setShowLoginModal(true, "login"); setIsMobileMenuOpen(false); }}
                                            className="w-full py-3 rounded-xl border-2 border-[#35104C] text-[#35104C] font-bold text-[14px] hover:bg-[#35104C] hover:text-white transition-all"
                                        >
                                            Đăng nhập
                                        </button>
                                        <button
                                            onClick={() => { setShowLoginModal(true, "register"); setIsMobileMenuOpen(false); }}
                                            className="w-full py-3 rounded-xl bg-[#6CD1FD] text-white font-bold text-[14px] shadow-lg active:scale-95 transition-all"
                                        >
                                            Đăng ký miễn phí
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#6CD1FD]/20 flex items-center justify-center">
                                            <FiUser size={18} className="text-[#35104C]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-bold text-[#35104C] truncate">{user.customerName || user.email || "Bạn"}</p>
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
                title={<span className="text-lg font-bold text-[#35104C]">Thông tin cá nhân</span>}
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
                title={<span className="text-lg font-bold text-[#35104C]">Lịch sử đặt lịch</span>}
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
                title={<span className="text-lg font-bold text-[#35104C]">Đổi mật khẩu</span>}
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
