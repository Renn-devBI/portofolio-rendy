import { Target, Lightbulb, TrendingUp, CheckCircle2, Sparkles, Zap, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Visi Kami",
      description: "Menjadi penyedia layanan cetak dan fotokopi terdepan yang dikenal karena kecepatan, kualitas, dan harga terjangkau",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Lightbulb,
      title: "Misi Kami",
      description: "Memberikan solusi cetak yang simpel, cepat, dan efisien untuk semua kalangan dengan teknologi modern",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50"
    },
    {
      icon: TrendingUp,
      title: "Komitmen Kami",
      description: "Terus berinovasi dan meningkatkan kualitas layanan untuk kepuasan pelanggan yang maksimal",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
  ];

  const advantages = [
    { text: "Proses cepat dengan waktu tunggu minimal", icon: Zap },
    { text: "Harga terjangkau untuk pelajar dan mahasiswa", icon: Sparkles },
    { text: "Kualitas hasil cetak yang tajam dan rapi", icon: Award },
    { text: "Layanan pre-order untuk produk kustom", icon: CheckCircle2 },
    { text: "Lokasi strategis dan mudah diakses", icon: Target },
    { text: "Staff yang ramah dan profesional", icon: Lightbulb },
  ];

  return (
    <section id="tentang" className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-green-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100 to-green-100 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Hero Header Section */}
        <div className="text-center mb-16 md:mb-24">
          {/* Logo dengan Animasi */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-2xl border border-blue-100 flex items-center justify-center p-6 transform group-hover:scale-105 transition-transform duration-500">
                <img 
                  src="/logo2.png" 
                  alt="Printology Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Title dengan Gradient */}
          <div className="space-y-4 mb-8">
            <div className="inline-block">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 bg-clip-text text-transparent">
                Tentang Printology
              </h2>
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-3/4 mx-auto"></div>
            </div>
          </div>

          {/* Description dengan Card Modern */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-blue-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-400/10 to-transparent rounded-full -ml-20 -mb-20"></div>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed relative z-10">
                Printology adalah solusi cetak dan fotokopi yang <span className="font-bold text-blue-600">simpel</span>, <span className="font-bold text-blue-600">cepat</span>, dan <span className="font-bold text-green-600">efisien</span>. 
                Kami hadir untuk memenuhi kebutuhan cetak Anda dengan layanan berkualitas dan harga yang bersahabat.
              </p>
            </div>
          </div>
        </div>

        {/* Vision, Mission, Commitment - Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20 md:mb-28">
          {values.map((value, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-3xl"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <CardHeader className="pb-4 pt-8 px-6 relative z-10">
                <div className="flex flex-col items-center">
                  {/* Icon Container dengan Gradient */}
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg bg-gradient-to-br ${value.color} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <value.icon className="h-9 w-9 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl text-gray-800 font-bold text-center">
                    {value.title}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pb-8 relative z-10">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center">
                  {value.description}
                </p>
              </CardContent>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Card>
          ))}
        </div>

        {/* Advantages Section dengan Modern Grid */}
        <div className="mb-20 md:mb-28">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Keunggulan Layanan Kami
            </h3>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-32 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {advantages.map((advantage, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex items-start gap-4 relative z-10">
                  {/* Icon dengan Gradient Background */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <advantage.icon className="h-5 w-5 text-white" />
                  </div>
                  
                  <p className="text-sm md:text-base text-gray-700 flex-1 leading-relaxed pt-1.5">
                    {advantage.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section dengan Modern Design */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem]">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500" style={{
            backgroundSize: '200% 200%',
            animation: 'gradient 8s ease infinite'
          }}></div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-14 md:px-12 md:py-16 lg:px-16 lg:py-20 text-center">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {/* Icon dengan Background */}
              <div className="inline-flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" style={{
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Heading */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight px-4">
                  Siap untuk Mulai Mencetak?
                </h3>
                <div className="h-1 w-24 sm:w-32 bg-white/50 rounded-full mx-auto"></div>
              </div>
              
              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto px-4">
                Kunjungi kami atau hubungi untuk informasi lebih lanjut dan dapatkan penawaran terbaik untuk kebutuhan cetak Anda
              </p>
              
              {/* Button */}
              <div className="pt-2 sm:pt-4">
                <button 
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 lg:px-12 py-4 sm:py-4.5 lg:py-5 bg-white text-blue-600 font-bold rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-white/30 text-sm sm:text-base lg:text-lg overflow-hidden transform hover:scale-105 active:scale-95"
                  onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    Hubungi Kami Sekarang
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 group-hover:rotate-12 transition-all duration-300" />
                  </span>
                  
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          {/* Additional Decorative Elements for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-10 w-2 h-2 bg-white/40 rounded-full"></div>
          <div className="hidden lg:block absolute top-1/3 right-16 w-3 h-3 bg-white/30 rounded-full"></div>
          <div className="hidden lg:block absolute bottom-1/3 left-20 w-2 h-2 bg-white/40 rounded-full"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </section>
  );
};

export default About;