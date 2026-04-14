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

// --- EFFECT 3: MINI MUSIC PLAYER (YouTube version) ---
const MiniMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Video ID từ link của bạn: e5Td3zrVdX4
  const videoId = "e5Td3zrVdX4";

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="absolute top-[180px] left-[5%] z-50 flex items-center gap-4 bg-white/20 backdrop-blur-md p-3 px-5 rounded-full border border-white/30 shadow-2xl group hover:bg-white/30 transition-all cursor-pointer" onClick={togglePlay}>
      {/* Hidden YouTube Player */}
      <div className="hidden">
        {isPlaying && (
          <iframe
            width="1"
            height="1"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
            allow="autoplay"
          ></iframe>
        )}
      </div>

      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className={`w-full h-full rounded-full bg-[#35104C] flex items-center justify-center border-2 border-[#6CD1FD]/50 ${isPlaying ? 'shadow-[0_0_15px_rgba(108,209,253,0.5)]' : ''}`}
        >
          <div className="w-3 h-3 bg-[#6CD1FD] rounded-full"></div>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none">
          {isPlaying ? <FiX size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /> : <FaPlay size={12} className="ml-0.5" />}
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-[15px] font-semibold text-[#35104C] leading-none mb-1">Mốc nè anh Huy</p>
        <div className="flex items-center gap-1 h-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: isPlaying ? [4, 12, 4] : 4,
                backgroundColor: isPlaying ? "#6CD1FD" : "#35104C/40"
              }}
              transition={{
                duration: 0.5 + (i * 0.1),
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-1 rounded-full bg-[#35104C]"
            />
          ))}
        </div>
      </div>
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
      <section className="bg-[#E9DCD6] relative pt-20 pb-32">
        <BackgroundRibbons />
        <MiniMusicPlayer />

        <div className="px-6 pt-2 pb-2 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[1200px] mx-auto mb-10"
          >
            {/* Audio Visualizer before title */}
            <div className="mb-8">
              <AudioWaveform />
            </div>

            <h1
              className="text-5xl md:text-[88px] font-bold leading-[1.02] tracking-tighter text-[#35104C] mb-8"
              style={{ fontFamily: '"DM Serif Display", serif' }}
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
              className="text-[17px] md:text-[23px] font-medium text-[#35104C]/80 mb-10 max-w-[850px] mx-auto tracking-tight leading-relaxed"
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
              className="px-12 py-5 bg-[#6CD1FD] text-white rounded-full text-[20px] font-bold mb-10 shadow-xl shadow-sky/10 active:scale-95"
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
              <div className="flex items-center gap-4 px-8 py-2.5 bg-white border border-[#f0d9c4] rounded-full shadow-sm">
                <div className="text-2xl text-[#e8762b]">
                  <FaMicrophone />
                </div>
                <div className="text-left">
                  <p className="text-[16px] font-semibold text-[#e8762b] leading-tight">Phong cách - Sáng tạo - Năng lượng</p>
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
        <div className="max-w-[1180px] mx-auto px-4 flex justify-center py-10 relative z-10">
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
            className="w-full max-w-[1000px] h-auto rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative z-10"
          />
        </div>
      </section>

      {/* --- SECTION 1: IN ACTION --- */}
      <section className="pt-64 pb-24 px-6 bg-white relative mt-0">
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block relative mb-16"
          >
            <div className="absolute inset-0 bg-[#ff99ed]/20 -rotate-2 blur-3xl transform scale-150"></div>
            <h2 className="text-4xl md:text-[54px] font-bold tracking-tight text-[#35104C] relative" style={{ fontFamily: '"DM Serif Display", serif' }}>
              hastudio qua từng khung hình
            </h2>
          </motion.div>

          {/* --- COLLAGE LAYOUT --- */}
          <div className="relative h-[1000px] md:h-[1400px] w-full max-w-[1400px] mx-auto mt-10">
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
        className="pb-32 pt-24 px-6 bg-[#F0EBE8] -mt-[300px] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]"
        style={{ borderRadius: '50% 50% 50% 50% / 100px 100px 100px 100px' }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center relative mb-20">


            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-[54px] font-bold tracking-tight text-[#35104C] relative"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Tận hưởng âm nhạc, trọn vẹn cảm xúc
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              {
                label: "Âm thanh chi tiết",
                title: "Tối giản hay cầu kỳ? Bạn quyết định",
                desc: "Tùy chỉnh độ dày của nhạc cụ, giọng hát để tạo nên một bản phối hoàn hảo nhất theo ý muốn.",
                img: decor1
              },
              {
                label: "Đa dạng phong cách",
                title: "Mọi phong cách nhạc đều được đáp ứng",
                desc: "Từ Pop, Ballad đến Rock hay EDM, đội ngũ của chúng tôi luôn sẵn sàng hiện thực hóa ý tưởng của bạn.",
                img: decor2
              },
              {
                label: "Bảng màu cảm xúc",
                title: "Khám phá sắc thái âm nhạc mới",
                desc: "Thay đổi màu sắc âm thanh thông qua các thiết bị analog hiện đại, mang lại sự ấm áp và chiều sâu.",
                img: decor3
              },
              {
                label: "Quy trình chuyên nghiệp",
                title: "Từ phác thảo đến hoàn thiện",
                desc: "Chúng tôi đồng hành cùng bạn từ lúc thu demo cho đến khi có bản Master cuối cùng chuẩn quốc tế.",
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
                  className="mb-4 aspect-square flex items-center justify-center transition-all duration-500 p-6"
                >
                  <img src={tool.img} alt={tool.label} className="w-full h-full object-cover rounded-[40px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
                </motion.div>

                <p className="text-[18px] font-bold text-[#35104C]/60 mb-3 px-2">{tool.label}</p>
                <h3
                  className="text-2xl md:text-[28px] font-semibold text-[#35104C] mb-4 leading-tight px-2"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                >
                  {tool.title}
                </h3>
                <p className="text-[17px] text-gray-500 leading-relaxed px-2">
                  {tool.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-20">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (user) navigate("/booking");
                else setShowLoginModal(true, "signup");
              }}
              className="px-12 py-4 bg-[#6CD1FD] text-[#35104C] rounded-full font-bold text-[17px] shadow-lg active:scale-95"
            >
              Xem bảng giá dịch vụ
            </motion.button>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: STYLES SHOWCASE --- */}
      <section className="pt-20 pb-0 px-6 bg-white relative">
        <div className="max-w-[1200px] mx-auto relative min-h-[600px] flex flex-col items-center justify-center">

          {/* 1. TOP-LEFT: Illustration image */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotate: -10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-[320px] h-[320px] rounded-[40px] hidden lg:flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
          >
            <img src={section3_anh1} alt="Style 1" className="w-full h-full object-cover" />
          </motion.div>

          {/* 2. TOP-LEFT: Smaller image */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-10 left-[280px] w-24 h-24 rounded-2xl hidden lg:block overflow-hidden shadow-xl"
          >
            <img src={section3_anh2} alt="Style 2" className="w-full h-full object-cover" />
          </motion.div>

          {/* 3. RIGHT: Main mockup image */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute top-[40px] right-[60px] w-[260px] aspect-square rounded-[28px] hidden lg:flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
          >
            <img src={section3_anh3} alt="Style 3" className="w-full h-full object-cover" />
          </motion.div>

          {/* 4. BOTTOM-LEFT: Illustration image */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-[20px] left-[150px] w-[220px] h-[220px] rounded-[32px] hidden lg:flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
          >
            <img src={decor4} alt="Style 4" className="w-full h-full object-cover" />
          </motion.div>

          {/* 5. BOTTOM-RIGHT: Work image */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute bottom-[10px] right-0 w-[240px] h-[220px] rounded-[32px] hidden lg:flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
          >
            <img src={section3_anh5} alt="Style 5" className="w-full h-full object-cover" />
          </motion.div>

          {/* CENTER CONTENT */}
          <div className="relative z-10 text-center max-w-[600px]">
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-[100px] md:text-[54px] font-bold tracking-tight text-[#35104C] leading-[1.1] mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Đa dạng phong cách cho mọi cá tính âm nhạc
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
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#6CD1FD] text-white rounded-full font-bold text-[20px] shadow-lg shadow-sky/30"
            >
              <FaMicrophone className="text-xl" /> Khám phá phòng thu ngay
            </motion.button>
          </div>

        </div>
      </section>

      {/* --- ILLUSTRATED WITH HASTUDIO --- */}
      <section className="px-6 pt-[100px] pb-20 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-[52px] font-bold text-[#35104C] mb-6"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Ghi dấu ấn cùng hastudio
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[20px] mb-4 max-w-5xl mx-auto leading-relaxed"
          >
            Nơi khơi nguồn cảm hứng và hiện thực hóa mọi ý tưởng âm nhạc. Hastudio tự hào là cộng sự tin cậy trên con đường nghệ thuật của bạn.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-[18px] font-bold text-[#35104C] mb-12"
          >Mỗi bản ghi là một câu chuyện, mỗi dự án là một kiệt tác.</motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: App Screens - Coral/Red */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#ff5a5a] rounded-[24px] p-8 pt-10 pb-8 min-h-[420px] flex items-center justify-center relative overflow-hidden group cursor-pointer"
            >
              <div className="flex gap-4 items-start">
                {/* Phone Screen 1 */}
                <motion.div
                  whileHover={{ y: -10 }}
                  className="w-[140px] bg-white rounded-[16px] p-4 shadow-lg"
                >
                  <p className="text-[10px] font-bold text-[#35104C] mb-1">itsbroken</p>
                  <p className="text-[13px] font-bold text-[#35104C] leading-tight mb-3">Welcome to the repair shop</p>
                  <div className="w-full h-[100px] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-3xl">🔧</span>
                  </div>
                  <div className="w-full py-2 bg-[#ff5a5a] rounded-md text-white text-[10px] font-bold text-center mb-2">Sign up</div>
                  <div className="w-full py-2 border border-gray-200 rounded-md text-[#35104C] text-[10px] font-bold text-center">Log in</div>
                </motion.div>
                {/* Phone Screen 2 */}
                <motion.div
                  whileHover={{ y: -10 }}
                  className="w-[140px] bg-white rounded-[16px] p-4 shadow-lg mt-6"
                >
                  <p className="text-[13px] font-bold text-[#35104C] leading-tight mb-3">Create Account</p>
                  <div className="w-full h-[60px] bg-gray-50 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="w-full h-2.5 bg-gray-100 rounded"></div>
                    <div className="w-full h-2.5 bg-gray-100 rounded"></div>
                    <div className="w-full h-2.5 bg-gray-100 rounded"></div>
                  </div>
                  <div className="w-16 py-1.5 bg-[#ff5a5a] rounded-md text-white text-[9px] font-bold text-center mb-2">Sign up</div>
                  <div className="w-full py-1.5 border border-gray-200 rounded-md text-[#35104C] text-[9px] font-bold text-center">Log in</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Card 2: Book Cover - Yellow */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#ffe24d] rounded-[24px] p-8 min-h-[420px] flex items-center justify-center relative overflow-hidden cursor-pointer"
            >
              <div className="w-[220px] bg-[#c8c4a8] rounded-[8px] p-6 shadow-xl relative transform -rotate-2">
                <div className="absolute top-0 left-0 w-full h-full border-2 border-[#b8b498] rounded-[8px]"></div>
                <div className="relative z-10">
                  <p className="text-[9px] uppercase tracking-widest text-[#5a5840] mb-1">The</p>
                  <h3 className="text-[28px] font-black text-[#2d4a2d] leading-none mb-1" style={{ fontFamily: '"DM Serif Display", serif' }}>Walking<br />Club</h3>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#5a5840] mb-4">Walking Notes</p>
                  <div className="w-full h-[140px] bg-[#4a8c4a]/20 rounded-lg flex items-end justify-center overflow-hidden relative">
                    <motion.div
                      animate={{ height: ["50%", "70%", "50%"] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute bottom-0 w-full bg-[#2d7a2d]/30 rounded-t-full"
                    ></motion.div>
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-4xl relative z-10 mb-2"
                    >🚶‍♀️</motion.span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Annual Report - Gray/Purple */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#9e9eab] rounded-[24px] p-8 min-h-[420px] flex items-center justify-center relative overflow-hidden cursor-pointer"
            >
              <div className="w-[200px] bg-[#2a2355] rounded-[8px] p-5 shadow-xl relative transform rotate-2">
                <p className="text-[8px] uppercase tracking-widest text-white/60 mb-1">Annual</p>
                <h3 className="text-[22px] font-black text-white leading-none mb-0.5" style={{ fontFamily: '"DM Serif Display", serif' }}>Report</h3>
                <p className="text-[24px] font-black text-[#ff8c42] leading-none mb-3">2023</p>
                <div className="w-full h-[160px] bg-[#3d3570] rounded-lg flex items-center justify-center overflow-hidden relative">
                  <motion.div
                    animate={{ height: ["40%", "80%", "40%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-12 bg-[#ff8c42] rounded-t-lg"
                  ></motion.div>
                  <motion.div
                    animate={{ height: ["60%", "30%", "60%"] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute bottom-0 right-4 w-10 bg-[#4FC3F7] rounded-t-lg"
                  ></motion.div>
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-4xl relative z-10"
                  >🎸</motion.span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-[1200px] mx-auto bg-[#f8f3ed] rounded-[48px] p-12 md:p-16 lg:p-20 relative overflow-hidden"
        >
          {/* Decorative shapes */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-8 right-[30%] w-24 h-24 bg-[#4ECDC4] rounded-full opacity-80"
          ></motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#ff69b4] rounded-full opacity-60"
          ></motion.div>
          <div className="absolute bottom-12 left-20 w-16 h-16 bg-[#ff99cc] rounded-full opacity-50"></div>
          <div className="absolute top-1/2 left-[15%] w-[200px] h-[200px] bg-[#c9b8d4]/30 -rotate-12 rounded-lg"></div>
          <div className="absolute top-[20%] left-[25%] w-[120px] h-[120px] bg-[#d4c4de]/20 rotate-12 rounded-lg"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Left side */}
            <div className="max-w-[480px]">
              <p className="text-[17px] text-[#35104C]/60 mb-3 flex items-center gap-2">
                Đăng ký nhận tin <FiSend className="text-[#6CD1FD] text-xl" />
              </p>
              <h2 className="text-3xl md:text-[44px] font-semibold text-[#35104C] leading-[1.15]" style={{ fontFamily: '"DM Serif Display", serif' }}>Nhận thông báo về các ưu đãi và dự án mới nhất!</h2>
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
          <div className="flex flex-col lg:flex-row gap-16 mb-6">
            {/* Left: Logo + Social */}
            <div className="lg:w-[280px] shrink-0">
              <div className="flex items-center gap-2 mb-10">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-brand-orange rounded-sm rotate-12"></div>
                  <div className="absolute inset-0 bg-sky rounded-sm -rotate-6"></div>
                  <div className="absolute inset-0 bg-plum rounded-sm flex items-center justify-center text-white text-[10px] font-bold">HA</div>
                </div>
                <span className="text-[28px] font-bold text-[#35104C]" style={{ fontFamily: '"Satisfy", cursive' }}>hastudio</span>
              </div>
              <div className="flex gap-6 mt-6">
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
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-10">
              <div>
                <h4 className="font-bold text-[#35104C] text-[17px] mb-6">hastudio</h4>
                <ul className="space-y-3 text-[17px] text-[#35104C]">
                  <li className="cursor-pointer">Bảng giá</li>
                  <li className="cursor-pointer" onClick={() => setShowLoginModal(true, "signup")}>Đăng ký</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[17px] mb-6">Công ty</h4>
                <ul className="space-y-3 text-[17px] text-[#35104C]">
                  <li className="cursor-pointer">Về chúng tôi</li>
                  <li className="cursor-pointer">Tuyển dụng</li>
                  <li className="cursor-pointer">Tư liệu truyền thông</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[17px] mb-6">Hỗ trợ</h4>
                <ul className="space-y-3 text-[17px] text-[#35104C]">
                  <li className="cursor-pointer">Cộng đồng</li>
                  <li className="cursor-pointer">Liên hệ</li>
                  <li className="cursor-pointer">Chứng nhận</li>
                  <li className="cursor-pointer">Bảo mật</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[17px] mb-6">Thành viên</h4>
                <ul className="space-y-3 text-[17px] text-[#35104C]">
                  <li className="cursor-pointer">Dự án miễn phí</li>
                  <li className="cursor-pointer">Glyphy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-2">
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
