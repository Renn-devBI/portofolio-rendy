import { Tag, Clock, Star, Zap } from "lucide-react";

const Promo = () => {
  const promoItems = [
    { service: "Fotokopi HVS 70gr", price: "Rp500/lembar" },
    { service: "Print Dokumen (Hitam Putih)", price: "Rp1.000/lembar" },
    { service: "Print Dokumen (Berwarna)", price: "Rp2.000/lembar" },
    { service: "Cetak Foto 2R", price: "Rp2.000/lembar" },
    { service: "Cetak Foto 3R", price: "Rp3.000/lembar" },
    { service: "Cetak Foto 4R", price: "Rp5.000/lembar" },
    { service: "Sticker Vinyl (Custom)", price: "Rp4.000 - Rp10.000" },
    { service: "Laminating Kartu", price: "Rp2.000/kartu" },
  ];

  return (
    <section id="promo" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto">
        {/* Header Section - COMPACT */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full mb-3 sm:mb-4 shadow-md">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">DAFTAR HARGA TERBARU</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Menu Harga Printology
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Harga kompetitif dengan kualitas premium untuk semua kebutuhan cetak Anda
          </p>
        </div>

        {/* Main Promo Card - COMPACT */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            
            {/* Header Banner - COMPACT */}
            <div className="bg-gradient-to-br from-blue-600 to-green-600 p-4 sm:p-6 md:p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 tracking-tight">PRINTOLOGY PRICE LIST</h3>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Simpel • Cepat • Efisien</p>
              </div>
            </div>

            {/* Price List Content - COMPACT GRID */}
            <div className="p-4 sm:p-6 md:p-8 bg-white">
              {/* Compact Price Grid - 2 KOLOM untuk tablet/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {promoItems.map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg hover:from-blue-100 hover:to-green-100 transition-all duration-200 group border border-blue-100 hover:border-blue-200"
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-gray-900 pr-2">
                      {item.service}
                    </span>
                    <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent whitespace-nowrap flex-shrink-0">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Features Section - COMPACT */}
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                {/* Pre-Order Feature */}
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-1">Sistem Pre-Order</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Produk kustom: sticker, poster, photocard. Waktu 1-3 hari kerja dengan konsultasi gratis.
                    </p>
                  </div>
                </div>

                {/* Quality Feature */}
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-1">Kualitas Premium</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Mesin high-end & bahan berkualitas untuk hasil cetak tajam, tahan lama, dan memuaskan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Banner - COMPACT */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 sm:p-4 text-center border-t border-blue-200">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                💫 <span className="font-semibold text-blue-600">Special Offer:</span> Diskon 10% untuk order di atas 50 lembar!
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info - COMPACT */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-200">
            <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            <span className="text-xs text-gray-600">
              <span className="font-semibold text-green-600">Gratis</span> konsultasi desain
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promo;