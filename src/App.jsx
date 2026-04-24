import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ScrollToHash from "./api/utils/ScrollToHash";
import { lazy, Suspense, useState, useEffect, useRef, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlay, FaRobot } from "react-icons/fa";
import { FiZap, FiGrid, FiMessageCircle, FiX, FiMusic, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Components & UI
import NewNavbar from "./components/layout/NewNavbar";
import StudioBackground from "./components/layout/StudioBackground";
import PageLoader from "./components/ui/PageLoader";
import BrandLoader from "./components/ui/BrandLoader";
import ErrorBoundaryWrapper from "./components/ui/ErrorBoundaryWrapper";
import ChatBox from "./components/features/chat/ChatBox";
import LoginModal from "./components/features/auth/LoginModal";
import AIAudioEnhancerModal from "./components/features/ai/AIAudioEnhancerModal";
import useAppStore from "./stores/useAppStore";
import useAuthStore from "./stores/useAuthStore";

// --- LAZY LOADING ROUTES (Enterprise Optimization) ---
const NewLandingPage = lazy(() => import("./components/sections/NewLandingPage"));
const User = lazy(() => import("./components/features/user/User"));
const AdminRoute = lazy(() => import("./components/features/admin/AdminRoute"));
const AdminLayout = lazy(() => import("./components/features/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./components/features/admin/AdminDashboard"));
const BookingManagement = lazy(() => import("./components/features/admin/BookingManagement"));
const ProductManagement = lazy(() => import("./components/features/admin/ProductManagement"));
const ServiceManagement = lazy(() => import("./components/features/admin/ServiceManagement"));
const UserManagement = lazy(() => import("./components/features/admin/UserManagement"));
const ChatManagement = lazy(() => import("./components/features/admin/ChatManagement"));
const ProductShowcase = lazy(() => import("./components/features/user/ProductShowcase"));
const Services = lazy(() => import("./components/features/user/Services"));
const AboutUs = lazy(() => import("./components/features/user/AboutUs"));
const Booking = lazy(() => import("./components/features/user/Booking"));
const OAuth2Callback = lazy(() => import("./components/features/auth/OAuth2Callback"));

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
const MiniMusicPlayer = ({ isPlaying, onToggle }) => {
  const { t } = useTranslation();

  return (
    <div
      className="hidden sm:flex fixed bottom-24 left-4 sm:top-[120px] sm:left-6 sm:bottom-auto z-[90] items-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-xl p-2 sm:p-2.5 px-3 sm:px-4 rounded-full border border-white/20 shadow-2xl group hover:bg-white/20 transition-all cursor-pointer"
      onClick={onToggle}
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
        <p className="text-[15px] font-semibold text-[#35104C] leading-none mb-1">{t('nav.bg_music')}</p>
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
  const { t } = useTranslation();
  const showLoginModal = useAppStore(state => state.showLoginModal);
  const setShowLoginModal = useAppStore(state => state.setShowLoginModal);
  const loadProfile = useAuthStore(state => state.loadProfile);
  
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHubHovered, setIsHubHovered] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const playerRef = useRef(null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // --- MOUNT/AUTH SETUP ---
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
        height: '1',
        width: '1',
        videoId: 'l4Pkem30Q60',
        playerVars: {
          'autoplay': 0,
          'controls': 0,
          'loop': 1,
          'playlist': 'l4Pkem30Q60',
          'enablejsapi': 1,
          'origin': window.location.origin,
          'modestbranding': 1,
          'rel': 0,
          'mute': 0
        },
        events: {
          'onReady': (event) => {
             // Player is ready
          },
          'onStateChange': (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
            // Nếu bị ngắt quãng ngoài ý muốn (do trình duyệt hoặc lỗi mạng) khi đang bật nhạc
            if (event.data === window.YT.PlayerState.PAUSED && isMusicPlaying) {
               setTimeout(() => {
                 if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
                    playerRef.current.playVideo();
                 }
               }, 100);
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

  // Global Function for reliable playback control
  const togglePlayback = () => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') return;
    
    if (!isMusicPlaying) {
      playerRef.current.playVideo();
      setIsMusicPlaying(true);
    } else {
      playerRef.current.pauseVideo();
      setIsMusicPlaying(false);
    }
  };

  // Listen for toggleMusic event from sidebar menu
  useEffect(() => {
    window.addEventListener('toggleMusic', togglePlayback);
    return () => window.removeEventListener('toggleMusic', togglePlayback);
  }, [isMusicPlaying]);

  return (
    <>
      <ScrollToHash />

      {/* ROCK-SOLID GLOBAL MUSIC ENGINE - Anti-throttle configuration */}
      <div className="fixed -left-[3000px] top-0 w-[320px] h-[180px] pointer-events-none z-[-100] overflow-hidden">
        <div id="hb-music-engine"></div>
      </div>

      {!isAdminRoute && <NewNavbar />}

      {isAdminRoute ? (
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      ) : (
        <Suspense fallback={<BrandLoader />}>
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
        </Suspense>
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
                <span className="bg-[#35104C]/70 backdrop-blur-lg text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[12px] sm:text-[14px] font-bold shadow-xl border border-white/10">AI hastudio</span>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#35104C]/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-[#6CD1FD] shadow-xl hover:bg-[#6CD1FD] hover:text-[#35104C] transition-all active:scale-90"
                >
                  <FaRobot className="text-[18px] sm:text-[20px]" />
                </button>
              </motion.div>

              {/* Tool Option 2: Live Chat */}
              <motion.div
                initial={false}
                animate={isHubHovered ? { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" } : { opacity: 0, scale: 0.8, y: 20, pointerEvents: "none" }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <span className="bg-[#35104C]/70 backdrop-blur-lg text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[12px] sm:text-[14px] font-bold shadow-xl border border-white/10">Hỗ trợ & Nhạc</span>
                
                {/* Music Toggle in Hub */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayback();
                  }}
                  title={isMusicPlaying ? t('common.music_off', 'Music Off') : t('common.music_on', 'Music On')}
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${isMusicPlaying ? 'bg-sky text-[#35104C]' : 'bg-[#35104C]/40 text-white'} backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-xl hover:bg-[#6CD1FD] hover:text-[#35104C] transition-all active:scale-90`}
                >
                  <FiMusic className={`text-[18px] sm:text-[20px] ${isMusicPlaying ? "animate-pulse" : ""}`} />
                </button>

                {/* Chat Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsChatOpen(true);
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#35104C]/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-[#6CD1FD] hover:text-[#35104C] transition-all active:scale-90"
                >
                  <FiMessageCircle className="text-[18px] sm:text-[20px]" />
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
                className="w-12 h-12 sm:w-14 sm:h-14 bg-[#35104C] rounded-full flex items-center justify-center text-[#6CD1FD] shadow-2xl cursor-pointer border border-white/10 z-10"
              >
                {isHubHovered ? <FiX className="text-[20px] sm:text-[24px]" /> : <FiGrid className="text-[20px] sm:text-[24px]" />}
              </motion.button>
            </div>
          </div>

          {/* Chat Window Container - Standalone now */}
          <ChatBox
            isOpen={isChatOpen}
            onToggle={setIsChatOpen}
            onlyWindow={true}
          />

          {/* Music Player UI - Global Visibility */}
          <MiniMusicPlayer
            isPlaying={isMusicPlaying}
            onToggle={togglePlayback}
          />


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
    <ErrorBoundaryWrapper>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundaryWrapper>
  );
}

export default App;
