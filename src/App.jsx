import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import { useContext } from "react";
import { AuthContext } from "./api/AuthContext";

import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Booking from "./components/sections/Booking";
import Hero from "./components/sections/Hero";
import Introduction from "./components/sections/Introduction";
import Pricing from "./components/sections/Pricing";
import ProductMade from "./components/sections/ProductMade";
import Services from "./components/sections/Services";
import Highlight from "./components/sections/Highlight.";
import DescriptionMusic from "./components/sections/DescriptionMusic";
import User from "./components/layout/User";
import LoginModal from "./components/layout/LoginModal";
import { useState } from "react";

function HomePage() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      <Hero>
        <Introduction />
        <DescriptionMusic />
        <ProductMade />
        <Services />
        <Pricing onSelectService={setSelectedService} />
        <Booking selectedService={selectedService} />
        <Highlight />
        <Footer />
      </Hero>
    </>
  );
}

function AppContent() {
  const { showLoginModal, setShowLoginModal } = useContext(AuthContext);

  return (
    <>
      <NavBar />

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
