import React, { useState, useEffect, useContext, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight, FiSend, FiMessageCircle, FiX, FiMinus, FiImage, FiCode, FiMusic, FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import { FaPlay, FaMicrophone, FaReact, FaFacebookF, FaTiktok, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import { AuthContext } from "../../api/AuthContext";
import productApi from "../../api/productApi";
import phongthuImg from "../../assets/phongthu.png";
import section3_anh1 from "../../assets/section3_anh1.webp";
import section3_anh2 from "../../assets/section3_anh2.avif";
import section3_anh3 from "../../assets/section3_anh3.jpg";
import section3_anh4 from "../../assets/section3_anh4.jpg";
import section3_anh5 from "../../assets/section3_anh5.webp";

// Local Background Ribbons with CSS animations (Persistent & localized)
const BackgroundRibbons = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <style>
      {`
        @keyframes drift1 {
          0%, 100% { transform: translate(-30px, -20px); }
          50% { transform: translate(30px, 20px); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(40px, 10px); }
          50% { transform: translate(-40px, -30px); }
        }
        @keyframes drift3 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes drift4 {
          0%, 100% { transform: translateX(-100px); }
          50% { transform: translateX(100px); }
        }
        .ribbon-layer-1 { animation: drift1 5s ease-in-out infinite; }
        .ribbon-layer-2 { animation: drift2 6s ease-in-out infinite; }
        .ribbon-layer-3 { animation: drift3 4s ease-in-out infinite; transform-origin: center; }
        .ribbon-layer-4 { animation: drift4 8s linear infinite; }
      `}
    </style>
    <svg
      style={{ opacity: 0.5 }}
      className="absolute top-0 left-[-10%] w-[120%] h-full text-white/40" viewBox="0 0 1000 1000" preserveAspectRatio="none"
    >
      <path className="ribbon-layer-1" fill="none" stroke="currentColor" strokeWidth="100" strokeLinecap="round" d="M-100,400 C150,100 350,700 500,400 C650,100 850,700 1100,400" />
      <path className="ribbon-layer-2" fill="none" stroke="white" strokeWidth="60" strokeLinecap="round" opacity="0.3" d="M-100,550 C150,250 350,850 500,550 C650,250 850,850 1100,550" />
      <path className="ribbon-layer-3" fill="none" stroke="white" strokeWidth="15" strokeLinecap="round" opacity="0.2" d="M-100,450 C200,100 400,800 600,450 C800,100 900,800 1100,450" />
      <path className="ribbon-layer-4" fill="none" stroke="currentColor" strokeWidth="80" strokeLinecap="round" opacity="0.2" d="M-100,700 C150,400 350,1000 500,700 C650,400 850,1000 1100,700" />
    </svg>
  </div>
));
BackgroundRibbons.displayName = "BackgroundRibbons";

// Sử dụng URL ảnh mẫu để tránh lỗi build khi tệp chưa có trong assets
const decor1 = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=100&w=1200";
const decor2 = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=100&w=1600";
const decor3 = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=100&w=1200";
const decor4 = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=100&w=1600";
const decor5 = "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=100&w=1200";

// --- EFFECT 1: AUDIO WAVEFORM ---
const AudioWaveform = () => (
  <div className="flex items-center justify-center gap-[4px] h-[60px] opacity-40">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          height: [15, Math.random() * 50 + 20, 15],
          backgroundColor: ["#6CD1FD", "#35104C", "#6CD1FD"]
        }}
        transition={{
          duration: Math.random() * 1.2 + 0.6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-[3px] rounded-full"
      />
    ))}
  </div>
);

// --- EFFECT 2: FLOATING MUSIC ELEMENTS ---
const FloatingMusicElements = () => {
  const elements = [
    { icon: <FaMicrophone />, top: "15%", left: "8%", size: 45, color: "text-sky", delay: 0 },
    { icon: <FiMusic />, top: "25%", right: "12%", size: 38, color: "text-purple-400", delay: 1 },
    { icon: <FaPlay />, bottom: "35%", left: "15%", size: 28, color: "text-pink-400", delay: 2 },
    { icon: <FiMusic />, top: "60%", right: "8%", size: 32, color: "text-blue-400", delay: 1.5 },
    { icon: <FaMicrophone />, bottom: "20%", right: "20%", size: 40, color: "text-indigo-400", delay: 0.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((item, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom
          }}
          animate={{
            y: [0, -35, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay
          }}
          className={`${item.color}`}
        >
          {React.cloneElement(item.icon, { size: item.size })}
        </motion.div>
      ))}
    </div>
  );
};


const NewLandingPage = () => {
  const { user, logout, setShowLoginModal } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Product Showcase States - Kết nối dữ liệu thật từ Backend
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await productApi.getAll({ page: 0, size: 6 });
        const data = response.data?.data?.list || response.data?.content || response.data || [];
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProjects();
  }, []);

  const getThumbnail = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const v = url.match(/[?&]v=([^&]+)/) || url.match(/youtu.be\/([^?]+)/);
      const id = v ? v[1] : null;
      return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop";
    }
    // Đối với video host trực tiếp, dùng placeholder studio chất lượng cao
    return "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop";
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#35104C] selection:bg-sky/30 relative overflow-x-hidden">
      {/* --- HERO SECTION (BEIGE) --- */}
      <section className="bg-[#E9DCD6] relative pt-12 pb-8 md:pt-20 md:pb-32">
        <BackgroundRibbons />

        <div className="px-4 md:px-6 pt-2 pb-2 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[1200px] mx-auto mb-4 md:mb-10"
          >
            {/* Audio Visualizer before title */}
            <div className="mb-8">
              <AudioWaveform />
            </div>

            <h1
              className="text-[32px] leading-[1.1] md:text-[72px] md:leading-[1.02] font-bold tracking-tighter text-[#35104C] mb-6 md:mb-8"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Transform your <span className="relative inline-block text-[#6CD1FD]">
                voice
              </span>
              <br />
              into a Masterpiece
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-[16px] md:text-[23px] font-medium text-[#35104C]/80 mb-8 md:mb-10 max-w-[850px] mx-auto tracking-tight leading-relaxed px-2 md:px-0"
            >
              Phòng thu âm chuyên nghiệp với công nghệ hiện đại. <br />
              Nơi chắp cánh cho giọng hát của bạn.
            </motion.p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (user) navigate("/booking");
                else setShowLoginModal(true, "signup");
              }}
              className="px-8 py-4 md:px-12 md:py-5 bg-[#6CD1FD] text-white rounded-full text-[16px] md:text-[20px] font-bold mb-4 md:mb-10 shadow-xl shadow-sky/10 active:scale-95"
            >
              Đặt lịch thu âm ngay
            </motion.button>

            {/* Product Hunt Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-3 sm:gap-4 px-5 sm:px-8 py-2 sm:py-2.5 bg-white border border-[#f0d9c4] rounded-full shadow-sm">
                <div className="text-xl sm:text-2xl text-[#e8762b]">
                  <FaMicrophone />
                </div>
                <div className="text-left">
                  <p className="text-[13px] sm:text-[16px] font-semibold text-[#e8762b] leading-tight">Phong cách - Sáng tạo - Năng lượng</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION: IMAGE TRANSITION (BEIGE TO WHITE) --- */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#E9DCD6] overflow-hidden">
          <BackgroundRibbons />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
        <div className="max-w-[1180px] mx-auto px-4 flex justify-center py-4 md:py-10 relative z-10">
          {/* --- MOVING GLOW EFFECTS (HÀO QUANG) --- */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            {/* Lớp xanh lục (Cyan glow) */}
            <div className="absolute w-[80%] h-[70%] bg-cyan-400/40 rounded-full blur-[120px] animate-pulse mix-blend-screen transition-all duration-1000"></div>
            {/* Lớp tím (Purple glow) */}
            <div className="absolute w-[70%] h-[60%] bg-purple-500/30 rounded-full blur-[100px] animate-pulse delay-700 mix-blend-screen"></div>
            {/* Lớp xanh dương (Blue accent) */}
            <div className="absolute w-[60%] h-[50%] bg-blue-600/20 rounded-full blur-[80px] animate-bounce duration-[10s] opacity-60"></div>
          </div>

          <img
            src={phongthuImg}
            alt="Phòng thu Editor"
            className="w-full max-w-[1000px] h-auto rounded-[20px] md:rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] md:shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative z-10"
          />
        </div>
      </section>

      {/* --- SECTION 1: IN ACTION --- */}
      <section className="pt-24 sm:pt-32 md:pt-64 pb-24 sm:pb-16 md:pb-24 px-4 md:px-6 bg-white relative mt-0">
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block relative mb-6 sm:mb-16"
          >
            <div className="absolute inset-0 bg-[#ff99ed]/20 -rotate-2 blur-3xl transform scale-150"></div>
            <h2 className="text-[24px] sm:text-[28px] md:text-[48px] font-bold tracking-tight text-[#35104C] relative" style={{ fontFamily: '"Poppins", sans-serif' }}>
              hastudio qua từng khung hình
            </h2>
          </motion.div>

          {/* === MOBILE COLLAGE GRID === */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-6 gap-2 sm:gap-3 auto-rows-[80px] sm:auto-rows-[120px]">
              {/* Image 1 - Large portrait taking 3 cols, 3 rows */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col-span-3 row-span-3 rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg"
              >
                <img src={decor1} alt="Studio" className="w-full h-full object-cover" />
              </motion.div>

              {/* Image 2 - Wide landscape taking 3 cols, 2 rows */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="col-span-3 row-span-2 rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg"
              >
                <img src={decor2} alt="Recording" className="w-full h-full object-cover" />
              </motion.div>

              {/* Image 3 - Small square taking 3 cols, 1 row */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-3 row-span-2 rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg"
              >
                <img src={decor3} alt="Headphones" className="w-full h-full object-cover" />
              </motion.div>

              {/* Image 4 - Wide taking 4 cols, 2 rows */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="col-span-4 row-span-2 rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg"
              >
                <img src={decor4} alt="Instruments" className="w-full h-full object-cover" />
              </motion.div>

              {/* Image 5 - Square taking 2 cols, 2 rows */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="col-span-2 row-span-2 rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg"
              >
                <img src={decor5} alt="Music" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>

          {/* === DESKTOP COLLAGE (absolute positioning) === */}
          <div className="relative h-[1000px] lg:h-[1400px] w-full max-w-[1400px] mx-auto mt-10 hidden lg:block">
            {/* 1. Top Left - Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ y: -20, rotate: -2, transition: { duration: 0.3 } }}
              className="absolute top-[-5%] left-[2%] w-[30%] z-20"
            >
              <img src={decor1} alt="Mobile Mockup" className="w-full aspect-[10/13] object-cover rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]" />
            </motion.div>

            {/* 2. Top Center - Wide */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -20, transition: { duration: 0.3 } }}
              className="absolute top-[-1%] left-[36%] w-[45%] z-10"
            >
              <img src={decor2} alt="Web Mockup" className="w-full aspect-video object-cover rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]" />
            </motion.div>

            {/* 3. Top Right - Small portrait */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="absolute top-[3%] right-[-3%] w-[19%] z-20"
            >
              <img src={decor3} alt="Card Mockup" className="w-full aspect-[9/16] object-cover rounded-[30px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]" />
            </motion.div>

            {/* 4. Bottom Left - Large Web */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ x: 20, transition: { duration: 0.3 } }}
              className="absolute bottom-[33%] left-[-3%] w-[50%] z-30"
            >
              <img src={decor4} alt="Large Web Mockup" className="w-full aspect-[16/10] object-cover rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]" />
            </motion.div>

            {/* 5. Bottom Center - Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ y: -30, transition: { duration: 0.3 } }}
              className="absolute bottom-[21%] left-[52%] w-[28%] z-50 translate-x-[-20%]"
            >
              <img src={decor5} alt="Portrait Mockup" className="w-full aspect-[3/4] object-cover rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]" />
            </motion.div>

            {/* 6. Bottom Right - Side card */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ x: -20, transition: { duration: 0.3 } }}
              className="absolute top-[20%] right-[-8%] w-[50%] z-40 translate-y-10"
            >
              <img src={decor2} alt="Side Content" className="w-full aspect-video object-cover rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: CUSTOMIZATION TOOLS --- */}
      <section
        className="pb-10 md:pb-32 pt-10 md:pt-24 px-4 md:px-6 bg-[#F0EBE8] mt-8 sm:-mt-[200px] md:-mt-[300px] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]"
        style={{ borderRadius: '32px 32px 0 0 md:borderRadius: 50% 50% 50% 50% / 100px 100px 100px 100px' }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center relative mb-7 md:mb-6">


            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[28px] sm:text-[36px] md:text-[48px] font-bold tracking-tight text-[#35104C] relative px-2"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              tận hưởng âm nhạc, trọn vẹn cảm xúc
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 sm:gap-x-12 gap-y-8 sm:gap-y-16">
            {[
              {
                label: "Âm thanh chi tiết",
                title: "Tối giản hay cầu kỳ? Bạn quyết định",
                desc: "Tùy chỉnh độ dày của nhạc cụ, giọng hát để tạo nên một bản phối hoàn hảo.",
                img: decor1
              },
              {
                label: "a dạng phong cách",
                title: "Mọi phong cách nhạc đều được đáp ứng",
                desc: "Từ Pop, Ballad đến Rock hay EDM, đội ngũ của chúng tôi luôn sẵn sàng.",
                img: decor2
              },
              {
                label: "Bảng màu cảm xúc",
                title: "Khám phá sắc thái âm nhạc mới",
                desc: "Thay đổi màu sắc âm thanh thông qua các thiết bị analog hiện đại.",
                img: decor3
              },
              {
                label: "Quy trình chuyên nghiệp",
                title: "Từ phác thảo đến hoàn thiện",
                desc: "Chúng tôi đồng hành cùng bạn từ lúc thu demo cho đến bản Master chuẩn.",
                img: decor4
              }
            ].map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="mb-3 sm:mb-4 aspect-square flex items-center justify-center transition-all duration-500 p-1 sm:p-3 md:p-6"
                >
                  <img src={tool.img} alt={tool.label} className="w-full h-full object-cover rounded-[16px] sm:rounded-[20px] md:rounded-[40px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
                </motion.div>

                <h3
                  className="text-[15px] sm:text-2xl md:text-[28px] font-semibold text-[#35104C] mb-2 sm:mb-4 leading-tight px-1 sm:px-2"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                >
                  {tool.title}
                </h3>
                <p className="text-[13px] sm:text-[17px] text-gray-500 leading-relaxed px-1 sm:px-2 line-clamp-3 sm:line-clamp-none">
                  {tool.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-4 sm:mt-12">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (user) navigate("/booking");
                else setShowLoginModal(true, "signup");
              }}
              className="px-8 py-3 sm:px-12 sm:py-4 bg-[#6CD1FD] text-[#35104C] rounded-full font-bold text-[14px] sm:text-[17px] shadow-lg active:scale-95 transition-all"
            >
              Xem bảng giá dịch vụ
            </motion.button>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: STYLES SHOWCASE --- */}
      <section className="pt-24 md:pt-20 md:pb-0 px-4 md:px-6 bg-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">

          {/* === MOBILE LAYOUT === */}
          <div className="block lg:hidden">
            {/* Title */}
            <div className="text-center mb-6">
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#35104C] leading-[1.1] mb-3" style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                đa dạng phong cách
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-[15px] text-gray-500 mb-6"
              >
                Luôn cập nhật những xu hướng âm thanh mới nhất
              </motion.p>
            </div>

            {/* Image Grid - Mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-2 row-span-2 rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg aspect-square"
              >
                <img src={section3_anh1} alt="Style 1" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg aspect-square"
              >
                <img src={section3_anh2} alt="Style 2" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg aspect-square"
              >
                <img src={section3_anh3} alt="Style 3" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg aspect-video"
              >
                <img src={decor4} alt="Style 4" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg aspect-video"
              >
                <img src={section3_anh5} alt="Style 5" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {/* CTA Button - Mobile */}
            <div className="text-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6CD1FD] text-[#35104C] rounded-full font-bold text-[14px] shadow-lg shadow-sky/20 transition-all active:scale-95"
              >
                <FaMicrophone className="text-base" /> Khám phá phòng thu ngay
              </motion.button>
            </div>
          </div>

          {/* === DESKTOP LAYOUT (unchanged) === */}
          <div className="hidden lg:block relative min-h-[600px]">
            <div className="flex flex-col items-center justify-center min-h-[600px]">

              {/* 1. TOP-LEFT: Illustration image */}
              <motion.div
                initial={{ opacity: 0, x: -100, rotate: -10 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute top-0 left-0 w-[320px] h-[320px] rounded-[40px] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
              >
                <img src={section3_anh1} alt="Style 1" className="w-full h-full object-cover" />
              </motion.div>

              {/* 2. TOP-LEFT: Smaller image */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-10 left-[280px] w-24 h-24 rounded-2xl overflow-hidden shadow-xl"
              >
                <img src={section3_anh2} alt="Style 2" className="w-full h-full object-cover" />
              </motion.div>

              {/* 3. RIGHT: Main mockup image */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 10 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute top-[40px] right-[60px] w-[260px] aspect-square rounded-[28px] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
              >
                <img src={section3_anh3} alt="Style 3" className="w-full h-full object-cover" />
              </motion.div>

              {/* 4. BOTTOM-LEFT: Illustration image */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute bottom-[20px] left-[150px] w-[220px] h-[220px] rounded-[32px] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
              >
                <img src={decor4} alt="Style 4" className="w-full h-full object-cover" />
              </motion.div>

              {/* 5. BOTTOM-RIGHT: Work image */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute bottom-[10px] right-0 w-[240px] h-[220px] rounded-[32px] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
              >
                <img src={section3_anh5} alt="Style 5" className="w-full h-full object-cover" />
              </motion.div>

              {/* CENTER CONTENT */}
              <div className="relative z-10 text-center max-w-[600px]">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-[48px] font-bold tracking-tight text-[#35104C] leading-[1.1] mb-6" style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Đa dạng phong cách
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-[17px] mb-8"
                >
                  Luôn cập nhật những xu hướng âm thanh mới nhất
                </motion.p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-[#6CD1FD] text-[#35104C] rounded-full font-bold text-[20px] shadow-lg shadow-sky/20 transition-all active:scale-95"
                >
                  <FaMicrophone className="text-xl" /> Khám phá phòng thu ngay
                </motion.button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- ILLUSTRATED WITH HASTUDIO --- */}
      <section className="px-4 md:px-6 pt-32 md:pt-[100px] pb-32 md:pb-20 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#35104C] mb-4 md:mb-6 leading-tight px-2"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            ghi dấu ấn cùng hastudio
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[16px] sm:text-[18px] md:text-[20px] mb-4 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Nơi khơi nguồn cảm hứng và hiện thực hóa mọi ý tưởng âm nhạc. Hastudio tự hào là cộng sự tin cậy trên con đường nghệ thuật của bạn.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-[15px] sm:text-[16px] md:text-[18px] font-bold text-[#35104C] mb-12 px-4"
          >Mỗi bản ghi là một câu chuyện, mỗi dự án là một kiệt tác.</motion.p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-12">
            {/* Card 1: Music App UI - Coral/Red */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#ff5a5a] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 md:p-10 min-h-[280px] sm:min-h-[360px] md:min-h-[440px] flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-2xl shadow-red-500/20"
            >
              {/* Abstract background shapes */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl sm:blur-2xl"></div>

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-[100px] sm:w-[140px] md:w-[160px] bg-white rounded-[16px] sm:rounded-[24px] p-3 sm:p-4 shadow-2xl transform rotate-[-2deg]">
                  <div className="w-full aspect-square bg-[#35104C] rounded-lg sm:rounded-xl mb-2 sm:mb-3 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" alt="Song Cover" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <FaPlay className="text-white text-[10px] sm:text-base ml-0.5 sm:ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="h-1.5 sm:h-2 w-3/4 bg-[#35104C]/10 rounded-full"></div>
                    <div className="h-1 sm:h-1.5 w-1/2 bg-[#35104C]/5 rounded-full"></div>
                    <div className="pt-2 sm:pt-3 flex items-center justify-between">
                      <div className="h-0.5 sm:h-1 w-full bg-gray-100 rounded-full relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-[#ff5a5a]"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 sm:mt-6 text-white font-bold text-[10px] sm:text-base opacity-90 text-center">Music App</p>
              </div>
            </motion.div>

            {/* Card 2: Album Cover - Yellow */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#ffe24d] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 md:p-10 min-h-[280px] sm:min-h-[360px] md:min-h-[440px] flex items-center justify-center relative overflow-hidden cursor-pointer shadow-2xl shadow-yellow-500/20"
            >
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-[110px] sm:w-[160px] md:w-[180px] aspect-square bg-white rounded-lg p-1.5 sm:p-2 shadow-2xl transform rotate-[3deg] transition-transform duration-500 hover:rotate-0">
                  <div className="w-full h-full border-[4px] sm:border-[8px] border-[#35104C] flex flex-col items-center justify-center p-2 sm:p-3 text-center">
                    <p className="text-[6px] sm:text-[8px] uppercase tracking-[0.1em] font-bold text-[#35104C] mb-0.5 sm:mb-1">Original Motion Picture</p>
                    <h3 className="text-[14px] sm:text-[24px] md:text-[28px] font-black text-[#35104C] leading-none mb-0.5 sm:mb-1" style={{ fontFamily: '"Poppins", sans-serif' }}>THE<br />SOUND</h3>
                    <div className="w-4 sm:w-8 h-[1px] sm:h-[1.5px] bg-[#35104C] my-1 sm:my-3"></div>
                    <p className="text-[6px] sm:text-[8px] uppercase tracking-[0.1em] font-medium text-[#35104C]">Recorded at HA</p>
                  </div>
                </div>
                <p className="mt-4 sm:mt-6 text-[#35104C] font-bold text-[10px] sm:text-base opacity-80 text-center">Album Art</p>
              </div>
            </motion.div>

            {/* Card 3: Sound Wave - Gray/Purple */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#2a2355] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 md:p-10 min-h-[280px] sm:min-h-[360px] md:min-h-[440px] flex items-center justify-center relative overflow-hidden cursor-pointer shadow-2xl shadow-purple-900/40"
            >
              {/* Grid background effect */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-[120px] sm:w-[180px] md:w-[210px] h-[100px] sm:h-[150px] md:h-[180px] bg-white/5 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/10 p-3 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                      <div className="w-1 h-1 rounded-full bg-yellow-500"></div>
                      <div className="w-1 h-1 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-[6px] sm:text-[8px] text-white/40 font-mono tracking-widest uppercase">Mastering</span>
                  </div>

                  <div className="flex items-end justify-between h-12 sm:h-20 gap-0.5 sm:gap-1">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                        className="w-full bg-gradient-to-t from-[#6CD1FD] to-purple-400 rounded-full opacity-80"
                      ></motion.div>
                    ))}
                  </div>

                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/5 flex justify-between">
                    <div className="w-1/3 h-0.5 sm:h-1 bg-white/10 rounded-full"></div>
                    <div className="w-1/4 h-0.5 sm:h-1 bg-[#6CD1FD]/40 rounded-full"></div>
                  </div>
                </div>
                <p className="mt-4 sm:mt-6 text-white font-bold text-[10px] sm:text-base opacity-80 text-center">Audio Tools</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="px-4 md:px-6 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-[1200px] mx-auto bg-[#f8f3ed] rounded-[24px] md:rounded-[48px] p-6 sm:p-8 md:p-16 lg:p-20 relative overflow-hidden"
        >
          {/* Decorative shapes - refined for mobile */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-10 -right-6 sm:right-[30%] w-16 h-16 sm:w-24 sm:h-24 bg-[#4ECDC4] rounded-full opacity-40 sm:opacity-80 blur-lg sm:blur-none"
          ></motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-8 -left-8 w-20 h-20 sm:w-32 sm:h-32 bg-[#ff69b4] rounded-full opacity-30 sm:opacity-60 blur-lg sm:blur-none"
          ></motion.div>
          <div className="absolute bottom-12 left-20 w-16 h-16 bg-[#ff99cc] rounded-full opacity-50 hidden sm:block"></div>
          <div className="absolute top-1/2 left-[15%] w-[200px] h-[200px] bg-[#c9b8d4]/30 -rotate-12 rounded-lg hidden sm:block"></div>
          <div className="absolute top-[20%] left-[25%] w-[120px] h-[120px] bg-[#d4c4de]/20 rotate-12 rounded-lg hidden sm:block"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-8 md:gap-12">
            {/* Left side */}
            <div className="max-w-[480px]">
              <p className="text-[15px] md:text-[17px] text-[#35104C]/60 mb-2 md:mb-3 flex items-center gap-2">
                Đăng ký nhận tin <FiSend className="text-[#6CD1FD] text-lg md:text-xl" />
              </p>
              <h2 className="text-[24px] md:text-[38px] font-semibold text-[#35104C] leading-[1.15]" style={{ fontFamily: '"Poppins", sans-serif' }}>Nhận thông báo về các ưu đãi và dự án mới nhất!</h2>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-[380px] flex flex-col gap-4">
              <input type="text" placeholder="Họ và tên" className="px-6 py-4 rounded-xl bg-white border border-gray-200 w-full outline-none focus:ring-2 ring-[#6CD1FD]/30 transition-all text-[15px]" />
              <input type="email" placeholder="Địa chỉ email" className="px-6 py-4 rounded-xl bg-white border border-gray-200 w-full outline-none focus:ring-2 ring-[#6CD1FD]/30 transition-all text-[15px]" />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-[#6CD1FD] text-[#35104C] rounded-full font-bold text-[15px] w-fit mt-1 shadow-lg shadow-sky/20"
              >Đăng ký ngay</motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pb-12 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto border-t pt-20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-16 mb-6">
            {/* Left: Logo + Social */}
            <div className="lg:w-[280px] shrink-0">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-10">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-brand-orange rounded-sm rotate-12"></div>
                  <div className="absolute inset-0 bg-sky rounded-sm -rotate-6"></div>
                  <div className="absolute inset-0 bg-plum rounded-sm flex items-center justify-center text-white text-[10px] font-bold">HA</div>
                </div>
                <span className="text-[28px] font-bold text-[#35104C]" style={{ fontFamily: '"Satisfy", cursive' }}>hastudio</span>
              </div>
              <div className="flex justify-center lg:justify-start gap-6 mt-6">
                <a href="https://www.facebook.com/HUYANHPR" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF className="w-5 h-5 text-[#35104C] cursor-pointer hover:text-[#6CD1FD] transition-colors" />
                </a>
                <a href="https://www.instagram.com/hoanghuyanhpr?fbclid=IwY2xjawRK169leHRuA2FlbQIxMABicmlkETFPNDNBSHljVVhETUNsdndnc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHo-Kwen5S3fyAHZk-SMINQokDirzfthfKw0kjEq8osysQ1T8El9nIYwFPzt4_aem_JcXYOUWLCDqX99Zpi3g3wg" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="w-5 h-5 text-[#35104C] cursor-pointer hover:text-[#6CD1FD] transition-colors" />
                </a>
                <a href="https://www.tiktok.com/@huyanhproduction" target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="w-5 h-5 text-[#35104C] cursor-pointer hover:text-[#6CD1FD] transition-colors" />
                </a>
                <a href="https://www.threads.net/@hoanghuyanhpr?xmt=AQF0ZZW777cGRocf3aD_HCJdwv_fgOThsUi9JQ0QzyeJ-UY" target="_blank" rel="noopener noreferrer">
                  <SiThreads className="w-5 h-5 text-[#35104C] cursor-pointer hover:text-[#6CD1FD] transition-colors" />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 w-full">
              <div>
                <h4 className="font-bold text-[#35104C] text-[15px] sm:text-[17px] mb-4 sm:mb-6">hastudio</h4>
                <ul className="space-y-2 sm:space-y-3 text-[14px] sm:text-[17px] text-[#35104C]">
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Bảng giá</li>
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors" onClick={() => setShowLoginModal(true, "signup")}>Đăng ký</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[15px] sm:text-[17px] mb-4 sm:mb-6">Công ty</h4>
                <ul className="space-y-2 sm:space-y-3 text-[14px] sm:text-[17px] text-[#35104C]">
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Về chúng tôi</li>
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Tuyển dụng</li>
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Tư liệu truyền thông</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[15px] sm:text-[17px] mb-4 sm:mb-6">Hỗ trợ</h4>
                <ul className="space-y-2 sm:space-y-3 text-[14px] sm:text-[17px] text-[#35104C]">
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Cộng đồng</li>
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Liên hệ</li>
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Chứng nhận</li>
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Bảo mật</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[15px] sm:text-[17px] mb-4 sm:mb-6">Thành viên</h4>
                <ul className="space-y-2 sm:space-y-3 text-[14px] sm:text-[17px] text-[#35104C]">
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Dự án miễn phí</li>
                  <li className="cursor-pointer hover:text-[#6CD1FD] transition-colors">Glyphy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-2 border-t border-gray-100 lg:border-none text-center lg:text-left mt-8 lg:mt-0">
            <p className="text-[15px] text-slate-600">Được phát triển bởi <a href="https://www.facebook.com/HOVANDUYIT" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#6CD1FD] transition-colors">Hồ Văn Duy</a></p>
          </div>
        </div>
      </footer>

      {/* --- VIDEO MODAL PLAYER --- */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#35104C]/95 backdrop-blur-3xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/10"
              >
                <FiX size={24} />
              </button>

              {selectedProject.videoUrl?.includes("youtube.com") || selectedProject.videoUrl?.includes("youtu.be") ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedProject.videoUrl.match(/[?&]v=([^&]+)/)?.[1] ||
                    selectedProject.videoUrl.split("youtu.be/")[1]?.split("?")[0]
                    }?autoplay=1`}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedProject.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}

              {/* Tên dự án bên trong Modal */}
              <div className="absolute bottom-10 left-10 pointer-events-none hidden md:block">
                <p className="text-[#6CD1FD] font-bold text-sm uppercase tracking-widest mb-1">{selectedProject.author}</p>
                <h2 className="text-white text-3xl font-bold">{selectedProject.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewLandingPage;
