import { Copy, Printer, Sticker, CreditCard, Image as LucideImage, Sparkles, ShoppingCart, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";

const services = [
  {
    id: "fotokopi",
    icon: Copy,
    title: "Fotokopi",
    price: 500,
    priceDisplay: "Rp500/Lembar",
    description: "Fotokopi hitam putih dan berwarna dengan kualitas terbaik",
    image: "https://i.ibb.co.com/ZpZnw76J/fotokopi-bg.jpg"
  },
  {
    id: "print-dokumen",
    icon: Printer,
    title: "Print Dokumen",
    price: 1000,
    priceDisplay: "Rp1.000/Lembar",
    description: "Cetak dokumen dengan hasil tajam dan rapi",
    image: "https://i.ibb.co.com/q31W913B/print-bg.jpg"
  },
  {
    id: "sticker",
    icon: Sticker,
    title: "Sticker",
    price: 4000,
    priceDisplay: "Rp4.000 - Rp10.000",
    description: "Sticker custom dengan berbagai ukuran dan bahan",
    image: "https://i.ibb.co.com/1Y950fz7/sticker-bg.jpg"
  },
  {
    id: "laminating",
    icon: CreditCard,
    title: "Laminating Kartu",
    price: 2000,
    priceDisplay: "Rp2.000/Kartu",
    description: "Laminating kartu nama, ID card, dan lainnya",
    image: "https://i.ibb.co.com/qbsv6c0/laminating-bg.jpg"
  },
  {
    id: "cetak-foto",
    icon: LucideImage,
    title: "Cetak Foto",
    price: 2000,
    priceDisplay: "Rp2.000 - Rp8.000",
    description: "Cetak foto berbagai ukuran dengan kualitas premium",
    image: "https://i.ibb.co.com/bghYcftc/cetak-foto-bg.jpg"
  },
  {
    id: "produk-kustom",
    icon: Sparkles,
    title: "Produk Kustom",
    price: 0,
    priceDisplay: "Harga Bervariasi",
    description: "Sticker, poster, photocard, kartu ucapan custom",
    image: "https://i.ibb.co.com/x8dDSk96/custom-bg.jpg"
  },
];

const Services = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (service: any) => {
    if (service.price === 0) {
      // Untuk produk kustom, redirect ke contact
      const contactSection = document.getElementById('kontak');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    addToCart({
      id: service.id,
      name: service.title,
      price: service.price,
      description: service.description,
    });
  };

  return (
    <section id="layanan" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
            Layanan Kami
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Berbagai pilihan layanan cetak dengan harga terjangkau dan kualitas terjamin
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 group relative overflow-hidden bg-white hover:shadow-xl sm:hover:shadow-2xl rounded-xl sm:rounded-2xl"
            >
              {/* Section Gambar dengan tag img biasa */}
              <div className="relative h-24 sm:h-28 md:h-32 border-b-2 border-blue-200 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                {service.image && (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback jika gambar tidak ditemukan
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                {/* Overlay tipis untuk kontras */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              
              <CardHeader className="pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6">
                {/* Section Icon Terpisah */}
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300 mx-auto shadow-lg border-2 border-white"
                  style={{
                    background: 'linear-gradient(135deg, hsl(220, 90%, 45%), hsl(160, 80%, 45%))'
                  }}
                >
                  <service.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                </div>
                
                <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-3 sm:mb-4"></div>
                
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300 mb-2">
                  {service.title}
                </CardTitle>
                
                <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent text-center mb-3 sm:mb-4">
                  {service.priceDisplay}
                </div>

                <div className="w-10 sm:w-12 h-0.5 bg-gray-300 rounded-full mx-auto mb-3 sm:mb-4"></div>
                
                <CardDescription className="text-sm sm:text-base text-gray-600 text-center leading-relaxed px-2 sm:px-0">
                  {service.description}
                </CardDescription>
              </CardHeader>

              {/* Add to Cart Button */}
              <CardContent className="pt-0 pb-6 px-4 sm:px-6">
                <Button
                  onClick={() => handleAddToCart(service)}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  {service.price === 0 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Pesan Kustom
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Tambah ke Keranjang
                    </>
                  )}
                </Button>
              </CardContent>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
            </Card>
          ))}
        </div>

        <div className="mt-12 sm:mt-14 md:mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 sm:border-2 rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 shadow-md sm:shadow-lg">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">
              💡 <span className="font-bold text-blue-600">Sistem Pre-Order</span> tersedia untuk semua produk kustom
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
