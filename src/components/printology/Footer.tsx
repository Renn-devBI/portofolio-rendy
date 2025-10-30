import { Printer, Instagram, Facebook, Music2 } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Layanan", href: "#layanan" },
    { label: "Promo", href: "#promo" },
    { label: "Tentang", href: "#tentang" },
    { label: "Kontak", href: "#kontak" },
  ];

  const socialMedia = [
    { icon: Instagram, href: "https://www.instagram.com/printology.id1?igsh=bGxoeDRmdzczYXR0", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/share/1DHTSqkGkC/", label: "Facebook" },
    { icon: Music2, href: "https://www.tiktok.com/@printology7?_t=ZS-90bC2veCLwe&_r=1", label: "TikTok" },
  ];

  const developers = [
    "Rendy Widjaya (05202540050)",
    "Muhammad Rafiantama (05202540089)", 
    "Afdal Albani Aserih (05202540084)",
    "Ridwan Abdul Rozaq (05202540075)"
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="py-8 px-4 sm:py-12 md:py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-8">
            
            {/* Brand & Developer Section */}
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                  <Printer className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Printology
                  </h3>
                  <p className="text-sm text-gray-300">Go Print, Go Fast!</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold text-lg">Dikembangkan oleh Kelompok 1</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  {developers.map((developer, index) => (
                    <li key={index} className="leading-relaxed">
                      {developer}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Layanan cetak dan fotokopi yang simpel, cepat, dan efisien dengan harga terjangkau 
                  untuk pelajar, mahasiswa, profesional, dan UMKM.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-white">Link Cepat</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block text-base"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-white">Sosial Media</h4>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </a>
                ))}
              </div>
              <div className="text-gray-300 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span>📧</span>
                  <span>printology.my.id@gmail.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+62 822-6009-8942</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Jl. Raya Lenteng Agung No. 123, Jakarta LA</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
              <p className="text-center sm:text-left">
                &copy; {new Date().getFullYear()} Printology. All rights reserved.
              </p>
              <p className="flex items-center gap-2 text-center">
                Made with <span className="text-red-400">❤</span> for fast printing
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
