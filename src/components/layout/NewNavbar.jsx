import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiX, FiUser, FiGrid, FiChevronDown, FiLogOut, FiCalendar, FiLock } from "react-icons/fi";
import { AuthContext } from "../../api/AuthContext";
import { Modal } from "antd";
import Account from "../features/user/Account";
import BookingProfile from "../features/booking/BookingProfile";
import ChangePassword from "../features/user/ChangePassword";

const NewNavbar = () => {
    const { user, setShowLoginModal, logout } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'account' | 'booking' | 'password' | null
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinkClass = "relative py-1 group transition-all duration-300";
    const underlineClass = "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#35104C] transition-all duration-300 group-hover:w-full rounded-full";

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-8 py-3.5 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100" : "bg-transparent"
            }`}>
            <div className="grid grid-cols-3 items-center max-w-[1400px] mx-auto">
                {/* Left Column */}
                <div className="flex items-center gap-10">
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
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8">
                            <div className="absolute inset-0 bg-brand-orange rounded-sm rotate-12 transition-transform"></div>
                            <div className="absolute inset-0 bg-[#6CD1FD] rounded-sm -rotate-6 transition-transform"></div>
                            <div className="absolute inset-0 bg-[#35104C] rounded-sm flex items-center justify-center text-white text-[10px] font-bold">HA</div>
                        </div>
                        <span className="text-[40px] font-bold tracking-normal text-[#35104C] leading-none" style={{ fontFamily: '"Satisfy", cursive' }}>hastudio</span>
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

            {/* Modals */}
            <Modal
                title={<span className="text-lg font-bold text-[#35104C]">Thông tin cá nhân</span>}
                open={activeModal === "account"}
                onCancel={() => setActiveModal(null)}
                footer={null}
                closable={false}
                width={800}
                centered
                destroyOnClose
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
                destroyOnClose
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
                destroyOnClose
            >
                <div className="pt-4">
                    <ChangePassword />
                </div>
            </Modal>
        </nav>
    );
};

export default NewNavbar;
