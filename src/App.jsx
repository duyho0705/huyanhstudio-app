import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import { useContext, useState } from "react";
import { AuthContext } from "./api/AuthContext";
import ScrollToHash from "./api/utils/ScrollToHash";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import NewLandingPage from "./components/sections/NewLandingPage";
import User from "./components/features/user/User";
import LoginModal from "./components/features/auth/LoginModal";

function HomePage() {
  return (
    <NewLandingPage />
  );
}

function AppContent() {
  const { showLoginModal, setShowLoginModal } = useContext(AuthContext);

  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<User />} />
      </Routes>

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
