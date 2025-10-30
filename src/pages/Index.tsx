import { useState } from "react";
import Navigation from "@/components/printology/Navigation";
import Hero from "@/components/printology/Hero";
import Services from "@/components/printology/Services";
import Promo from "@/components/printology/Promo";
import About from "@/components/printology/About";
import Footer from "@/components/printology/Footer";
import Contact from "@/components/printology/Contact";
import CartModal from "@/components/printology/CartModal";

const IndexContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navigation onCartClick={handleCartClick} />
      <Hero />
      <Services />
      <Promo />
      <About />
      <Contact />
      <Footer />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

const Index = () => {
  return <IndexContent />;
};

export default Index;
