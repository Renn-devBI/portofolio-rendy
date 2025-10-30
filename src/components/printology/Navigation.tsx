import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";
import { useLocation, useNavigate } from "react-router-dom";

const Navigation = ({ onCartClick }: { onCartClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", href: "/", isExternal: false },
    { label: "Layanan", href: "/#layanan", isExternal: false },
    { label: "Promo", href: "/#promo", isExternal: false },
    { label: "Tentang", href: "/#tentang", isExternal: false },
   // { label: "Kontak", href: "/contact", isExternal: false },
    { label: "Chat Kami", href: "/#kontak", isExternal: false },
  ];

  const handleNavigation = (href: string, isExternal: boolean) => {
    if (isExternal) {
      window.location.href = href;
    } else {
      if (href === '/') {
        // Jika sudah di home page, scroll ke atas
        if (location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Jika di page lain, navigate ke home dulu lalu scroll ke atas
          navigate('/');
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }
      } else if (href.startsWith('/#')) {
        // Navigate to home first, then scroll to section
        if (location.pathname === '/') {
          // Jika sudah di home page, langsung scroll ke section
          const sectionId = href.split('#')[1];
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          // Jika di page lain, navigate ke home dulu lalu scroll ke section
          navigate('/');
          setTimeout(() => {
            const sectionId = href.split('#')[1];
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      } else {
        navigate(href);
      }
      setIsOpen(false);
    }
  };

  const isContactPage = location.pathname === '/contact';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
            onClick={() => {
              if (location.pathname === '/') {
                // Jika sudah di home page, scroll ke atas
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                // Jika di page lain, navigate ke home
                navigate('/');
              }
            }}
          >
            <img 
              src="/logo2.png" 
              alt="Printology Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Printology
              </h1>
              <p className="text-[10px] md:text-xs text-gray-600 font-medium">
                Go Print, Go Fast!
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href, item.isExternal)}
                className={`text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 ${
                  (location.pathname === item.href || 
                   (item.href === '/' && location.pathname === '/')) 
                    ? 'text-blue-600 font-semibold' 
                    : ''
                }`}
              >
                {item.label}
                {isContactPage && item.label === "Home" && (
                  <span className="ml-1 text-xs">← Kembali</span>
                )}
              </button>
            ))}

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative h-10 w-10 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                  {getTotalItems() > 99 ? '99+' : getTotalItems()}
                </span>
              )}
            </Button>

            <Button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Customer Service
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-11 w-11 bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white/90 backdrop-blur-xl border-t border-white/20">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.href, item.isExternal)}
              className={`block w-full text-left py-3 px-4 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300 ${
                (location.pathname === item.href || 
                 (item.href === '/' && location.pathname === '/')) 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {isContactPage && item.label === "Home" && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    ← Kembali
                  </span>
                )}
              </div>
            </button>
          ))}

          {/* Mobile Cart Button */}
          <Button
            variant="ghost"
            onClick={() => {
              onCartClick();
              setIsOpen(false);
            }}
            className="w-full justify-start h-14 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
          >
            <div className="relative mr-3">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[24px] h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                  {getTotalItems() > 99 ? '99+' : getTotalItems()}
                </span>
              )}
            </div>
            <span className="font-medium">Keranjang Belanja</span>
            {getTotalItems() > 0 && (
              <span className="ml-auto bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-bold">
                {getTotalItems()} item
              </span>
            )}
          </Button>

          <Button
            onClick={() => navigate('/contact')}
            className="w-full mt-4 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg transition-all duration-300"
          >
            Hubungi Kami
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;