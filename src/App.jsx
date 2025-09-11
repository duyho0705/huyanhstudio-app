import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/Navbar";
import Booking from "./components/sections/Booking";
import Hero from "./components/sections/Hero";
import Introduction from "./components/sections/Introduction";
import ProductMade from "./components/sections/ProductMade";
import Services from "./components/sections/Services";

function App() {
  return (
    <>
      <NavBar />
      <Hero>
        <Introduction />
        <Services />
        <ProductMade />
        <Booking />
        <Footer />
      </Hero>
    </>
  );
}

export default App;
