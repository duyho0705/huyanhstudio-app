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
import ProductShowcase from "./components/features/user/ProductShowcase";
import Services from "./components/features/user/Services";
import AboutUs from "./components/features/user/AboutUs";
import Booking from "./components/features/user/Booking";
import OAuth2Callback from "./components/features/auth/OAuth2Callback";
import LoginModal from "./components/features/auth/LoginModal";
import { AnimatePresence, motion } from "framer-motion";

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
