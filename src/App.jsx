import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import { useContext } from "react";
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
import StudioManagement from "./components/features/admin/StudioManagement";
import UserManagement from "./components/features/admin/UserManagement";
import DemoManagement from "./components/features/admin/DemoManagement";
import ChatManagement from "./components/features/admin/ChatManagement";
import ProductShowcase from "./components/features/user/ProductShowcase";
import Services from "./components/features/user/Services";
import AboutUs from "./components/features/user/AboutUs";
import Booking from "./components/features/user/Booking";
import OAuth2Callback from "./components/features/auth/OAuth2Callback";
import LoginModal from "./components/features/auth/LoginModal";
import ChatBox from "./components/features/chat/ChatBox";
import AIAudioEnhancerModal from "./components/features/ai/AIAudioEnhancerModal";
import { AnimatePresence, motion } from "framer-motion";
import { FaMagic } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import { useState } from "react";

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

function AppContent() {
  const { showLoginModal, setShowLoginModal } = useContext(AuthContext);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToHash />
      {!isAdminRoute && <NewNavbar />}

      {isAdminRoute ? (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
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
              <Route path="demos" element={<DemoManagement />} />
              <Route path="studios" element={<StudioManagement />} />
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
          <ChatBox />
          {/* Floating AI Button (Global) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsAIModalOpen(true)}
            className="fixed bottom-32 right-6 z-[90] cursor-pointer group"
          >
            <div className="absolute inset-0 bg-[#6CD1FD] blur-2xl opacity-20 group-hover:opacity-50 transition-all duration-500 rounded-full" />
            <div className="relative w-16 h-16 rounded-full bg-[#35104C] flex items-center justify-center text-[#6CD1FD] shadow-[0_10px_30px_rgba(53,16,76,0.5)] border border-white/20">
              <FaMagic size={24} className="group-hover:rotate-12 transition-transform" />
              <motion.div
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <FiZap size={16} fill="#6CD1FD" />
              </motion.div>
            </div>
            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#35104C] text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none">
              Thử AI Enhancer miễn phí ✨
            </div>
          </motion.div>

          <AIAudioEnhancerModal 
            isOpen={isAIModalOpen} 
            onClose={() => setIsAIModalOpen(false)} 
          />
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
