import { useState } from "react";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/Navbar";
import Booking from "./components/sections/Booking";
import Hero from "./components/sections/Hero";
import Introduction from "./components/sections/Introduction";
import Pricing from "./components/sections/Pricing";
import ProductMade from "./components/sections/ProductMade";
import Services from "./components/sections/Services";
import Highlight from "./components/sections/Highlight.";
function App() {
  const [selectedService, setSelectedService] = useState(null);
  return (
    <>
      <NavBar />
      <Hero>
        <Introduction />
        <ProductMade />
        <Services />
        <Pricing onSelectService={setSelectedService}/>
        <Booking selectedService={selectedService}/>
        <Highlight />
        <Footer />
      </Hero>
    </>
  );
}

export default App;
