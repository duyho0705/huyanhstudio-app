import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiX, FiUser, FiGrid } from "react-icons/fi";
import { AuthContext } from "../../api/AuthContext";

const NewNavbar = () => {
    const { user, setShowLoginModal } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLandingPage = location.pathname === "/";

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-8 py-3.5 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100" : "bg-transparent"
            }`}>
            <div className="grid grid-cols-3 items-center max-w-[1400px] mx-auto">
                {/* Left Column */}
                <div className="flex items-center gap-10">
                    <div className="hidden lg:flex items-center gap-8 text-[17px] font-semibold text-[#35104C]">
                        <Link to="/products" className="transition-colors hover:text-[#6CD1FD]">Product</Link>
                        <Link to="/services" className="transition-colors hover:text-[#6CD1FD]">Price and services</Link>
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
                        <a href="#" className="transition-colors hover:text-[#6CD1FD]">About Us</a>
                        {!user ? (
                            <button
                                onClick={() => setShowLoginModal(true, "login")}
                                className="transition-colors font-bold hover:text-[#6CD1FD]"
                            >
                                Sign in
                            </button>
                        ) : (
                            <div className="flex items-center gap-4 flex-nowrap">
                                <span className="text-[16px] font-medium text-[#35104C]/70 whitespace-nowrap">
                                    Xin chào, {user.customerName || user.email || "bạn"}
                                </span>
                                <Link
                                    to="/user"
                                    className="px-5 py-2 border border-gray-300 rounded-[15px] text-[15px] font-bold transition-all bg-white shadow-sm whitespace-nowrap"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                    {!user && (
                        <button
                            onClick={() => setShowLoginModal(true, "signup")}
                            className="px-6 py-2.5 bg-[#6CD1FD] text-white rounded-[15px] text-[17px] font-bold transition-all transform shadow-sm hover:shadow-md active:scale-95"
                        >
                            Sign up
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NewNavbar;
