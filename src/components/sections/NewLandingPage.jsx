import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSearch, FiArrowRight, FiSend, FiMessageCircle, FiX, FiMinus, FiImage, FiCode, FiMusic, FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import { FaPlay, FaMicrophone, FaReact } from "react-icons/fa";
import { AuthContext } from "../../api/AuthContext";
import phongthuImg from "../../assets/phongthu.png";
import section3_anh1 from "../../assets/section3_anh1.webp";
import section3_anh2 from "../../assets/section3_anh2.avif";
import section3_anh3 from "../../assets/section3_anh3.jpg";
import section3_anh4 from "../../assets/section3_anh4.jpg";
import section3_anh5 from "../../assets/section3_anh5.webp";

// Sử dụng URL ảnh mẫu để tránh lỗi build khi tệp chưa có trong assets
const decor1 = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=100&w=1200";
const decor2 = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=100&w=1600";
const decor3 = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=100&w=1200";
const decor4 = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=100&w=1600";
const decor5 = "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=100&w=1200";

const NewLandingPage = () => {
  const { user, logout, setShowLoginModal } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?", sender: "bot", time: "18:09" },
  ]);

  return (
    <div className="min-h-screen bg-white font-sans text-[#35104C] selection:bg-sky/30 relative overflow-x-hidden">
      {/* --- HERO SECTION (BEIGE) --- */}
      <section className="bg-[#E9DCD6] relative pt-10 pb-0">
        {/* Multiple Winding Ribbon Layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2 }}
            className="absolute top-0 left-[-10%] w-[120%] h-full text-white/40" viewBox="0 0 1000 1000" preserveAspectRatio="none"
          >
            {/* Layer 1: Main Thick Ribbon - Moderate */}
            <motion.path
              animate={{
                x: [-30, 30, -30],
                y: [-20, 20, -20]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              fill="none" stroke="currentColor" strokeWidth="100" strokeLinecap="round"
              d="M-100,400 C150,100 350,700 500,400 C650,100 850,700 1100,400"
            />
            {/* Layer 2: Medium Ribbon - Moderate */}
            <motion.path
              animate={{
                x: [40, -40, 40],
                y: [10, -30, 10]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              fill="none" stroke="white" strokeWidth="60" strokeLinecap="round" opacity="0.3"
              d="M-100,550 C150,250 350,850 500,550 C650,250 850,850 1100,550"
            />
            {/* Layer 3: Thin accent lines - Moderate */}
            <motion.path
              animate={{ rotate: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              fill="none" stroke="white" strokeWidth="15" strokeLinecap="round" opacity="0.2"
              d="M-100,450 C200,100 400,800 600,450 C800,100 900,800 1100,450"
            />
            {/* Layer 4: Deep bottom ribbon - Moderate */}
            <motion.path
              animate={{ x: [-100, 100, -100] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              fill="none" stroke="currentColor" strokeWidth="80" strokeLinecap="round" opacity="0.2"
              d="M-100,700 C150,400 350,1000 500,700 C650,400 850,1000 1100,700"
            />
          </motion.svg>
        </div>

        <div className="px-6 pt-2 pb-2 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[1200px] mx-auto mt-[50px] mb-10"
          >
            <h1 className="text-5xl md:text-[88px] font-bold leading-[1.02] tracking-tighter text-[#35104C] mb-8">
              Create <span className="relative inline-block">
                beautiful
              </span> illustrations,
              <br />
              no design skills needed
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-[17px] md:text-[23px] font-medium text-[#35104C]/80 mb-10 max-w-[850px] mx-auto tracking-tight leading-relaxed"
            >
              A growing illustration library that you can make your own
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoginModal(true, "signup")}
              className="px-12 py-5 bg-[#6CD1FD] text-white rounded-[20px] text-[20px] font-bold transition-all transform mb-10 shadow-xl shadow-sky/10 active:scale-95"
            >
              Find the perfect illustration
            </motion.button>

            {/* Product Hunt Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-4 px-8 py-2.5 bg-white border border-[#f0d9c4] rounded-full shadow-sm">
                <div className="text-2xl text-[#e8762b] animate-bounce">
                  <FaMicrophone />
                </div>
                <div className="text-left">
                  <p className="text-[16px] font-black text-[#e8762b] leading-tight">You are start of the Day</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION: IMAGE TRANSITION (BEIGE TO WHITE) --- */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#E9DCD6]"></div>
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
      <section className="py-24 px-6 bg-white relative overflow-hidden mt-[120px]">
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block relative mb-24"
          >
            <div className="absolute inset-0 bg-[#ff99ed]/20 -rotate-2 blur-3xl transform scale-150"></div>
            <h2 className="text-4xl md:text-[54px] font-bold tracking-tight text-[#35104C] relative">
              designstrip in action
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
              className="absolute top-[-8%] left-[2%] w-[30%] z-20"
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
            >
              enjoy your love, your feeling
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              {
                label: "Scene detail",
                title: "Minimal or complex? You get to decide",
                desc: "Add or remove objects from your scene, all while staying on topic and keeping beautiful composition.",
                img: decor1
              },
              {
                label: "Variations",
                title: "Swap and change every object, they all magically fit and work",
                desc: "Not feeling that chair? Swap it out. Want a different pose for a character? We've got you covered!",
                img: decor2
              },
              {
                label: "Color palette",
                title: "Explore endless color combos",
                desc: "Change the mood of your illustration with one click. Our smart color system ensures everything stays harmonious.",
                img: decor3
              },
              {
                label: "Sketch style",
                title: "Sketch or full color?",
                desc: "Switch between clean vector lines and hand-drawn sketch styles to match your brand's unique personality.",
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

                <p className="text-[15px] font-bold text-[#35104C]/60 mb-3 px-2">{tool.label}</p>
                <h3
                  className="text-2xl md:text-[28px] font-bold text-[#35104C] mb-4 leading-tight px-2"
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoginModal(true, "signup")}
              className="px-10 py-4 bg-[#6CD1FD] text-[#35104C] rounded-[18px] font-bold transition-all shadow-lg"
            >
              Try tools for free
            </motion.button>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: STYLES SHOWCASE --- */}
      <section className="pt-20 pb-0 px-6 bg-white overflow-hidden">
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
              Hand-crafted styles for every brand & use-case
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-[17px] mb-8"
            >
              With new styles being added constantly
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#6CD1FD] text-white rounded-full font-bold text-[18px] transition-all shadow-lg shadow-sky/30"
            >
              <FiMusic className="text-xl" /> Find the perfect illustration <FiArrowRight className="text-lg" />
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
          >
            Illustrated with hastudio
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[20px] mb-4 max-w-none mx-auto leading-relaxed whitespace-nowrap lg:whitespace-normal"
          >
            From big companies, to a small local shops to simple party invitations. We have something for every need!
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-[18px] font-bold text-[#35104C] mb-12"
          >More community creations coming soon!</motion.p>

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
              <p className="text-[15px] text-[#35104C]/60 mb-3">Join the mailing list 🎉</p>
              <h2 className="text-3xl md:text-[44px] font-bold text-[#35104C] leading-[1.15]">Be the first to get content updates!</h2>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-[380px] flex flex-col gap-4">
              <input type="text" placeholder="Full name" className="px-6 py-4 rounded-xl bg-white border border-gray-200 w-full outline-none focus:ring-2 ring-[#6CD1FD]/30 transition-all text-[15px]" />
              <input type="email" placeholder="Your email" className="px-6 py-4 rounded-xl bg-white border border-gray-200 w-full outline-none focus:ring-2 ring-[#6CD1FD]/30 transition-all text-[15px]" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-[#6CD1FD] text-[#35104C] rounded-xl font-bold text-[15px] w-fit mt-1 shadow-lg shadow-sky/20"
              >Subscribe</motion.button>
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
              <div className="flex gap-5 mt-6">
                <svg className="w-5 h-5 text-[#35104C] cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                <svg className="w-5 h-5 text-[#35104C] cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                <svg className="w-5 h-5 text-[#35104C] cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308a10.501 10.501 0 004.392-6.87zM15.895 19.59c-.155-.89-.756-3.996-2.19-7.737l-.066.022c-5.79 2.018-7.86 6.025-8.04 6.4a10.505 10.505 0 006.372 2.166c1.41 0 2.755-.288 3.924-.85zM4.003 16.9c.23-.38 3.058-4.97 8.386-6.66.135-.044.27-.085.405-.12-.125-.29-.255-.575-.392-.855-5.077 1.527-10.017 1.469-10.473 1.46l-.003.255c0 2.21.69 4.26 1.868 5.957l.209-.037zM2.498 9.27c.47.005 4.613.013 9.394-1.243C9.85 4.95 7.63 2.757 7.36 2.475A10.495 10.495 0 002.5 9.27zm6.43-7.687c.282.292 2.532 2.487 4.607 5.642 4.388-1.643 6.247-4.14 6.444-4.425a10.513 10.513 0 00-11.05-1.217zm12.095 2.65c-.242.318-2.268 2.94-6.82 4.793.12.245.235.494.345.745l.12.29c3.398-.426 6.78.257 7.115.33a10.505 10.505 0 00-.76-6.157z" /></svg>
              </div>
            </div>

            {/* Link Columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-10">
              <div>
                <h4 className="font-bold text-[#35104C] text-[17px] mb-6">Hastudio</h4>
                <ul className="space-y-3 text-[17px] text-[#35104C]">
                  <li className="cursor-pointer">Pricing</li>
                  <li className="cursor-pointer" onClick={() => setShowLoginModal(true, "signup")}>Sign up</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[17px] mb-6">Company</h4>
                <ul className="space-y-3 text-[17px] text-[#35104C]">
                  <li className="cursor-pointer">About us</li>
                  <li className="cursor-pointer">Careers</li>
                  <li className="cursor-pointer">Media kit</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[17px] mb-6">Support</h4>
                <ul className="space-y-3 text-[17px] text-[#35104C]">
                  <li className="cursor-pointer">Community</li>
                  <li className="cursor-pointer">Contact us</li>
                  <li className="cursor-pointer">License</li>
                  <li className="cursor-pointer">Privacy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#35104C] text-[17px] mb-6">Family</h4>
                <ul className="space-y-3 text-[17px] text-[#35104C]">
                  <li className="cursor-pointer">Free Illustrations</li>
                  <li className="cursor-pointer">Glyphy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-2">
            <p className="text-[14px] text-slate-600">Được phát triển bởi <span className="font-bold">Hồ Văn Duy</span></p>
          </div>
        </div>
      </footer>

      {/* --- FLOATING CHAT BOX --- */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
        {/* Chat Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mb-4 w-[380px] h-[550px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-[#6CD1FD] text-[#35104C] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 10 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm"
                  >
                    🎧
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-[17px] leading-tight">Hastudio Support</h4>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[12px] font-medium opacity-80">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                    <FiMinus className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fcf9f6]">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl text-[14px] leading-relaxed ${msg.sender === 'user'
                      ? 'bg-[#6CD1FD] text-[#35104C] rounded-tr-none'
                      : 'bg-white text-[#35104C] shadow-sm rounded-tl-none border border-gray-100'
                      }`}>
                      {msg.text}
                      <p className={`text-[10px] mt-1.5 opacity-50 ${msg.sender === 'user' ? 'text-right' : ''}`}>{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-5 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-[#f3f3f5] p-2 rounded-2xl border border-transparent focus-within:border-[#6CD1FD]/30 focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && setChatMessage("")}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent px-3 py-2 outline-none text-[14px] text-[#35104C]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-[#6CD1FD] text-[#35104C] rounded-xl flex items-center justify-center transition-transform shadow-lg shadow-sky/20"
                  >
                    <FiSend className="text-lg" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center text-2xl transition-all duration-500 transform ${isChatOpen ? 'bg-white text-[#35104C] rotate-180 scale-90' : 'bg-[#6CD1FD] text-[#35104C]'
            }`}
        >
          {isChatOpen ? <FiX className="text-3xl" /> : <FaReact className="text-3xl animate-[spin_5s_linear_infinite]" />}

          {/* Notification dot */}
          {!isChatOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 w-5 h-5 bg-[#e8762b] border-4 border-white rounded-full"
            ></motion.div>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default NewLandingPage;
