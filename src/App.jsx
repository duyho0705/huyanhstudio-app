import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import { AuthContext } from "./api/AuthContext";
import ScrollToHash from "./api/utils/ScrollToHash";
import NewNavbar from "./components/layout/NewNavbar";
import StudioBackground from "./components/layout/StudioBackground";
import NewLandingPage from "./components/sections/NewLandingPage";
import User from "./components/features/user/User";
import AdminRoute from "./components/features/admin/AdminRoute";
import AdminLayout from "./components/features/admin/AdminLayout";
import AdminDashboard from "./components/features/admin/AdminDashboard";
import BookingManagement from "./components/features/admin/BookingManagement";
import ProductManagement from "./components/features/admin/ProductManagement";
import ServiceManagement from "./components/features/admin/ServiceManagement";
import UserManagement from "./components/features/admin/UserManagement";
import ChatManagement from "./components/features/admin/ChatManagement";
import ProductShowcase from "./components/features/user/ProductShowcase";
import Services from "./components/features/user/Services";
import AboutUs from "./components/features/user/AboutUs";
import Booking from "./components/features/user/Booking";
import OAuth2Callback from "./components/features/auth/OAuth2Callback";
import LoginModal from "./components/features/auth/LoginModal";
import ChatBox from "./components/features/chat/ChatBox";
import AIAudioEnhancerModal from "./components/features/ai/AIAudioEnhancerModal";
import { AnimatePresence, motion, useSpring, useMotionValue } from "framer-motion";
import { FaMagic, FaPlay, FaRobot } from "react-icons/fa";
import { FiZap, FiGrid, FiMessageCircle, FiX } from "react-icons/fi";
import { useState, useEffect, useRef, useContext } from "react";


const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

// --- PERSISTENT MUSIC PLAYER UI ---
const MiniMusicPlayer = ({ isPlaying, setIsPlaying }) => {
  return (
    <div
      className="fixed sm:top-[120px] left-4 sm:left-6 z-[90] hidden sm:flex items-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-xl p-2 sm:p-2.5 px-3 sm:px-4 rounded-full border border-white/20 shadow-2xl group hover:bg-white/20 transition-all cursor-pointer"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Visualizer and Logic only, sound comes from Global Source */}
      <div className="relative w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center">
        {/* The Spinning Vinyl Record */}
        <motion.div
          animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className={`relative w-full h-full rounded-full bg-[#12061A] flex items-center justify-center shadow-2xl border-[3px] sm:border-4 border-[#35104C] ${isPlaying ? 'shadow-[0_0_20px_rgba(108,209,253,0.4)]' : ''}`}
        >
          {/* Vinyl Grooves (Subtle circles) */}
          <div className="absolute inset-1 rounded-full border border-white/5"></div>
          <div className="absolute inset-2 rounded-full border border-white/5"></div>
          <div className="absolute inset-3 rounded-full border border-white/5 hidden sm:block"></div>

          {/* Center Label */}
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#6CD1FD] rounded-full border-2 border-[#35104C] flex items-center justify-center">
            <div className="w-1 h-1 bg-[#35104C] rounded-full"></div>
          </div>
        </motion.div>

        {/* Play/Pause Overlay Icon (Appears on Hover) */}
        <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none">
          {isPlaying ? (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
            </div>
          ) : (
            <FaPlay size={8} className="ml-0.5 sm:ml-0.5" />
          )}
        </div>
      </div>

      <div className="flex-col hidden sm:flex">
        <p className="text-[15px] font-semibold text-[#35104C] leading-none mb-1">Nhạc nền</p>
        <div className="flex items-center gap-1 h-2.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: isPlaying ? [3, 10, 3] : 3,
                backgroundColor: isPlaying ? "#6CD1FD" : "rgba(53, 16, 76, 0.3)"
              }}
              transition={{
                duration: 0.5 + (i * 0.1),
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-0.5 rounded-full bg-[#35104C]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const { showLoginModal, setShowLoginModal } = useContext(AuthContext);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHubHovered, setIsHubHovered] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const playerRef = useRef(null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // --- YOUTUBE API SETUP ---
  useEffect(() => {
    // 1. Load the API script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // 2. This function creates an <iframe> (and YouTube player) after the API code downloads.
    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('hb-music-engine', {
        height: '180',
        width: '320',
        videoId: 'e5Td3zrVdX4',
        playerVars: {
          'autoplay': 0,
          'controls': 0,
          'loop': 1,
          'playlist': 'e5Td3zrVdX4',
          'enablejsapi': 1,
          'origin': window.location.origin,
          'modestbranding': 1,
          'rel': 0,
          'mute': 0,
          'host': 'https://www.youtube-nocookie.com'
        },
        events: {
          'onStateChange': (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // If API is already loaded (e.g. on hot reload)
    if (window.YT && window.YT.Player && !playerRef.current) {
      window.onYouTubeIframeAPIReady();
    }
  }, []);

  // Control playback based on state
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      if (isMusicPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isMusicPlaying]);

  // Listen for toggleMusic event from sidebar menu
  useEffect(() => {
    const handleToggleMusic = () => setIsMusicPlaying(prev => !prev);
    window.addEventListener('toggleMusic', handleToggleMusic);
    return () => window.removeEventListener('toggleMusic', handleToggleMusic);
  }, []);

  return (
    <>
      <ScrollToHash />

      {/* ROCK-SOLID GLOBAL MUSIC ENGINE - Anti-throttle configuration */}
      <div className="fixed top-0 left-0 w-1 h-1 opacity-[0.01] pointer-events-none z-[-1] overflow-hidden">
        <div id="hb-music-engine"></div>
      </div>

      {!isAdminRoute && <NewNavbar />}

      {isAdminRoute ? (
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="services" element={<ServiceManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="chat" element={<ChatManagement />} />
            </Route>
            <Route path="/oauth2/redirect" element={<OAuth2Callback />} />
          </Routes>
        </AnimatePresence>
      ) : (
        <StudioBackground>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="w-full"
                  >
                    <NewLandingPage />
                  </motion.div>
                }
              />
              <Route
                path="/user"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="w-full"
                  >
                    <User />
                  </motion.div>
                }
              />
              <Route
                path="/services"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="w-full"
                  >
                    <Services />
                  </motion.div>
                }
              />
              <Route
                path="/about"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="w-full"
                  >
                    <AboutUs />
                  </motion.div>
                }
              />
              <Route
                path="/products"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="w-full"
                  >
                    <ProductShowcase />
                  </motion.div>
                }
              />
              <Route
                path="/booking"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="w-full"
                  >
                    <Booking />
                  </motion.div>
                }
              />
              <Route path="/oauth2/redirect" element={<OAuth2Callback />} />
            </Routes>
          </AnimatePresence>
        </StudioBackground>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      {!isAdminRoute && (
        <>
          {/* Hastudio Magic Hub - Expanding Toolbox */}
          <div
            className="fixed bottom-6 right-6 z-[100]"
            onMouseLeave={() => setIsHubHovered(false)}
          >
            <div className="flex flex-col items-end gap-3 relative">

              {/* Tool Option 1: AI Audio Enhancer */}
              <motion.div
                initial={false}
                animate={isHubHovered ? { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" } : { opacity: 0, scale: 0.8, y: 20, pointerEvents: "none" }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="bg-[#35104C]/70 backdrop-blur-lg text-white px-3 py-1.5 rounded-lg text-[14px] font-bold shadow-xl border border-white/10">AI hastudio</span>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="w-12 h-12 bg-[#35104C]/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-[#6CD1FD] shadow-xl hover:bg-[#6CD1FD] hover:text-[#35104C] transition-all active:scale-90"
                >
                  <FaRobot size={20} />
                </button>
              </motion.div>

              {/* Tool Option 2: Live Chat */}
              <motion.div
                initial={false}
                animate={isHubHovered ? { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" } : { opacity: 0, scale: 0.8, y: 20, pointerEvents: "none" }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <span className="bg-[#35104C]/70 backdrop-blur-lg text-white px-3 py-1.5 rounded-lg text-[14px] font-bold shadow-xl border border-white/10">Hỗ trợ</span>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="w-12 h-12 bg-[#35104C]/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-[#6CD1FD] hover:text-[#35104C] transition-all active:scale-90"
                >
                  <FiMessageCircle size={20} />
                </button>
              </motion.div>

              {/* Main Hub Trigger - Mouse Enter here exclusively */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHubHovered(!isHubHovered);
                }}
                onMouseEnter={() => setIsHubHovered(true)}
                animate={isHubHovered ? { rotate: 90, scale: 1.1 } : { rotate: 0, scale: 1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-[#35104C] rounded-full flex items-center justify-center text-[#6CD1FD] shadow-2xl cursor-pointer border border-white/10 z-10"
              >
                {isHubHovered ? <FiX size={24} /> : <FiGrid size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Chat Window Container - Standalone now */}
          <ChatBox
            isOpen={isChatOpen}
            onToggle={setIsChatOpen}
            onlyWindow={true}
          />

          {/* Music Player UI - Only visible on Home Page */}
          {!isAdminRoute && location.pathname === "/" && (
            <MiniMusicPlayer
              isPlaying={isMusicPlaying}
              setIsPlaying={setIsMusicPlaying}
            />
          )}


          <AIAudioEnhancerModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
          />

          {/* Special Visual Effect: Sound Wave Cursor removed */}
        </>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
