import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center pt-16 md:pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(194, 91%, 64%) 0%, hsl(187, 70%, 70%) 100%)'
      }}
    >
      {/* Modern Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-white/5 rounded-lg rotate-45 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 sm:w-6 sm:h-6 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-white/5 rotate-12 animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Modern Badge - RESPONSIVE */}
          <div className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/15 backdrop-blur-md rounded-full mb-4 sm:mb-6 animate-fade-in border border-white/20 shadow-lg">
            <div className="relative">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
            </div>
            <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Layanan Cetak Tercepat di Kota
            </span>
          </div>

          {/* Modern Typography - RESPONSIVE */}
          <div className="animate-fade-in">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
                Printology
              </span>
              <br />
              <span className="text-white/90 font-semibold tracking-tight text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Go Print, Go Fast!
              </span>
            </h1>
          </div>
          
          {/* Modern Description - RESPONSIVE */}
          <div className="relative mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in">
            <div className="backdrop-blur-sm bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 relative overflow-hidden group hover:bg-white/15 transition-all duration-500">
              {/* Background Logo */}
              <div 
                className="absolute inset-0 opacity-[0.02] bg-contain bg-center bg-no-repeat scale-150"
                style={{ backgroundImage: 'url(/logo2.png)' }}
              ></div>
              
              {/* Text Content */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white relative z-10 font-medium">
                Layanan cetak dan fotokopi cepat dengan harga terjangkau untuk{" "}
                <span className="font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                  pelajar, mahasiswa, profesional, dan UMKM
                </span>
              </p>
            </div>
          </div>
          
          {/* Modern Buttons - RESPONSIVE */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in">
            {/* Primary Button */}
            <Button 
              size="lg"
              className="w-full xs:w-auto h-11 sm:h-12 md:h-14 px-6 sm:px-8 text-sm sm:text-base md:text-lg text-white transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 font-semibold border-0 relative overflow-hidden group"
              style={{ 
                background: 'linear-gradient(135deg, hsl(220, 90%, 45%) 0%, hsl(160, 80%, 45%) 100%)',
                boxShadow: '0 8px 32px 0 rgba(30, 64, 175, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, hsl(220, 90%, 50%) 0%, hsl(160, 80%, 50%) 100%)';
                e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(30, 64, 175, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, hsl(220, 90%, 45%) 0%, hsl(160, 80%, 45%) 100%)';
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(30, 64, 175, 0.4)';
              }}
              onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center">
                Lihat Layanan
                <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            
            {/* Secondary Button */}
            <Button 
              size="lg"
              variant="outline"
              className="w-full xs:w-auto h-11 sm:h-12 md:h-14 px-6 sm:px-8 text-sm sm:text-base md:text-lg border-2 text-white hover:text-white transition-all duration-500 font-semibold relative overflow-hidden group backdrop-blur-md"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, hsl(220, 90%, 45%) 0%, hsl(160, 80%, 45%) 100%)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(30, 64, 175, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10">Hubungi Kami</span>
            </Button>
          </div>

          {/* Modern Stats - RESPONSIVE */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 md:gap-8 mt-8 sm:mt-12 md:mt-16 max-w-2xl mx-auto animate-fade-in">
            {[
              { number: "500+", label: "Pelanggan Puas" },
              { number: "10 Menit", label: "Rata-rata Waktu" },
              { number: "Rp500", label: "Mulai Dari" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-white/70 group-hover:text-white/90 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - RESPONSIVE */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;