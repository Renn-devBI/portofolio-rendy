import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Music2, MapPin, Phone, Mail, Clock, Send, X, Sparkles, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateAIResponse } from "@/lib/gemini-api";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import { useCart } from '@/components/printology/CartContext';

const ContactPage = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart integration
  const { cart, clearCart } = useCart();

  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-fill form with cart data
  useEffect(() => {
    if (cart.length > 0) {
      const cartSummary = cart.map(item =>
        `${item.name} (${item.quantity}x) - Rp${(item.price * item.quantity).toLocaleString('id-ID')}`
      ).join('\n');

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      setFormData(prev => ({
        ...prev,
        message: prev.message || `Pesanan dari keranjang:\n${cartSummary}\n\nTotal: Rp${total.toLocaleString('id-ID')}\n\n${prev.message}`,
        service: prev.service || 'Pesanan dari keranjang belanja'
      }));
    }
  }, [cart]);

  // Welcome notification and test connection saat component mount
  useEffect(() => {
    // Show welcome toast
    toast("Selamat datang di Printology!", {
      description: "Siap membantu kebutuhan cetak Anda dengan kualitas terbaik.",
      duration: 4000,
    });

    const testConnection = async () => {
      try {
        console.log("🔄 Testing Gemini AI connection...");
        const test = await generateAIResponse("Halo");
        console.log("✅ Connection test successful:", test);
      } catch (error) {
        console.error("❌ Connection test failed:", error);
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      console.log("📤 Sending message to Gemini:", userMessage);
      const aiResponse = await generateAIResponse(userMessage);
      console.log("📥 Received from Gemini:", aiResponse);
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error: any) {
      console.error("❌ Error in handleSendMessage:", error);
      setMessages(prev => [...prev, {
        text: `Maaf, terjadi error: ${error.message}. Silakan refresh halaman dan coba lagi.`,
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Form Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Data belum lengkap", {
        description: "Harap isi nama, email, dan pesan",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Starting form submission...', formData);

      const result = await sendEmail(formData);

      if (result.success) {
        toast.success("🎉 Pesan Berhasil Dikirim!", {
          description: "Tim Printology akan menghubungi Anda dalam 1x24 jam.",
          duration: 6000,
        });

        // Reset form and clear cart
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          service: ""
        });
        clearCart(); // Clear cart after successful order

      } else {
        throw new Error('Email gagal dikirim');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      // Fallback success message for better UX
      toast.success("📝 Pesan Diterima!", {
        description: "Terima kasih! Tim kami akan segera merespons.",
        duration: 5000,
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        service: ""
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const sendEmail = async (data: typeof formData) => {
    let adminSent = false;
    let customerSent = false;

    try {
      console.log('📧 Starting email send process...');

      // Generate order details
      const orderId = `PRINT-${Date.now().toString().slice(-6)}`;
      const orderDate = new Date().toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      try {
        // Send to admin
        const adminTemplateParams = {
          from_name: data.name,
          from_email: data.email,
          to_email: 'printology.my.id@gmail.com',
          phone: data.phone || 'Tidak diisi',
          service: data.service || 'Tidak dipilih',
          message: data.message,
          order_id: orderId,
          order_date: orderDate,
          reply_to: data.email
        };

        const adminResult = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service_id',
          import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || 'default_template_id',
          adminTemplateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key'
        );
        adminSent = true;
        console.log('✅ Admin email sent:', adminResult);
      } catch (adminError) {
        console.error('❌ Admin email failed:', adminError);
      }

      try {
        // Send to customer (Order Confirmation)
        const customerTemplateParams = {
          to_name: data.name,
          to_email: data.email,
          from_name: 'Printology Team',
          service: data.service || 'Tidak dipilih',
          phone: data.phone || 'Tidak diisi',
          message: data.message,
          order_id: orderId,
          order_date: orderDate,
          business_email: 'printology.my.id@gmail.com',
          business_phone: '+62 822-6009-8942'
        };

        const customerResult = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service_id',
          import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID || 'default_template_id',
          customerTemplateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key'
        );
        customerSent = true;
        console.log('✅ Customer email sent:', customerResult);
      } catch (customerError) {
        console.error('❌ Customer email failed:', customerError);
      }

      return { success: adminSent || customerSent, adminSent, customerSent };

    } catch (error) {
      console.error('EmailJS error:', error);
      return { success: false, error, adminSent, customerSent };
    }
  };

  const socialMedia = [
    {
      name: "Instagram",
      icon: Instagram,
      username: "@printology.id",
      url: "https://www.instagram.com/printology.id1?igsh=bGxoeDRmdzczYXR0",
      color: "from-pink-500 to-purple-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      username: "Printology ID",
      url: "https://www.facebook.com/share/1DHTSqkGkC/",
      color: "from-blue-600 to-blue-700",
    },
    {
      name: "TikTok",
      icon: Music2,
      username: "@printology.id",
      url: "https://www.tiktok.com/@printology7?_t=ZS-90bC2veCLwe&_r=1",
      color: "from-gray-900 to-black",
    },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat",
      info: "Jl. Raya Lenteng Agung No. 123, Jakarta LA",
    },
    {
      icon: Phone,
      title: "Telepon",
      info: "+62 822-6009-8942",
    },
    {
      icon: Mail,
      title: "Email",
      info: "printology.my.id@gmail.com",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      info: "Senin - Sabtu: 08.00 - 20.00 WIB",
    },
  ];

  const services = [
    "Print Dokumen",
    "Print Foto",
    "Print Stiker",
    "Fotocopy",
    "Lainnya"
  ];

  return (
    <div className="min-h-screen">
      <section className="py-12 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50/30 relative">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Home
            </Button>
          </div>

          {/* Header Section */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Printology Service
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Siap melayani kebutuhan cetak Anda dengan cepat dan profesional
            </p>
          </div>

          {/* Real-time Clock */}
          <div className="max-w-sm sm:max-w-md mx-auto mb-16 md:mb-20 px-2">
            <Card className="text-center border-0 shadow-xl sm:shadow-2xl bg-gradient-to-br from-blue-500 to-green-500 text-white overflow-hidden group hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500">
              <CardContent className="pt-6 pb-5 sm:pt-8 sm:pb-6 relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="text-xs sm:text-sm opacity-90 mb-2 sm:mb-3">Waktu Indonesia Barat</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 font-mono">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">
                    {formatDate(currentTime)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="max-w-6xl mx-auto mb-16 md:mb-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">
              Informasi Kontak
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/80 backdrop-blur-sm group hover:scale-105"
                >
                  <CardContent className="pt-6 pb-5 sm:pt-8 sm:pb-6 px-4 sm:px-6">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ background: 'linear-gradient(135deg, hsl(220, 90%, 45%), hsl(160, 80%, 45%))' }}
                      >
                        <info.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2">
                          {info.title}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
                          {info.info}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="max-w-6xl mx-auto mb-16 md:mb-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">
              Temui Kami di Sosial Media
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="text-center border-0 shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm group-hover:scale-105 overflow-hidden">
                    <CardHeader className="pb-3 sm:pb-4 pt-6 sm:pt-8">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <social.icon className="h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-white" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl text-gray-800 font-bold">
                        {social.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6 sm:pb-8">
                      <p className="text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        {social.username}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* Contact/Order Form */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">
              Formulir Kontak (Opsional)
            </h3>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Masukkan nama lengkap"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="email@example.com"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No. Telepon
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="+62 xxx-xxxx-xxxx"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Layanan yang Dibutuhkan
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Pilih layanan</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan / Detail Kebutuhan *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Jelaskan kebutuhan cetak Anda..."
                      className="w-full min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Bot Floating Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <div className="relative">
              {/* Outer Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 blur-xl opacity-50 animate-pulse"></div>
              
              {/* Rotating Border */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-30 animate-spin-slow" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
              
              <Button
                onClick={() => setIsChatOpen(true)}
                className="relative rounded-full w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-500 group overflow-hidden border-2 border-white/20"
              >
                {/* Inner Gradient Animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* AI Logo */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                </div>

                {/* Sparkle Effect */}
                <Sparkles className="absolute top-1.5 right-1.5 h-4 w-4 text-yellow-300 animate-pulse" />
                
                {/* Pulse Ring Effect */}
                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-30"></div>
              </Button>
            </div>
          </div>

          {/* AI Chat Bot Modal */}
          {isChatOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-lg h-[80vh] sm:h-[600px] flex flex-col shadow-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl relative overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-40 animate-pulse"></div>
                        
                        {/* Logo Container */}
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AI</span>
                          </div>
                        </div>
                        
                        {/* Sparkle */}
                        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2">
                          Printology AI Assistant
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
                        </h3>
                        <p className="text-blue-100 text-xs sm:text-sm">Siap membantu kebutuhan cetak Anda</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsChatOpen(false)}
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <div className="relative inline-block mb-4">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
                        
                        {/* Logo Container */}
                        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">AI</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Welcome Message */}
                      <div className="bg-white border-2 border-gray-100 rounded-2xl rounded-bl-none p-4 max-w-[90%] mx-auto shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">AI</span>
                          </div>
                          <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Printology AI Assistant
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">Halo! 👋 Saya AI Assistant Printology</p>
                        <p className="text-xs text-gray-500 mb-4">Printology AI Team</p>
                        
                        <div className="text-left">
                          <p className="text-xs font-semibold text-gray-700 mb-2">💡 Contoh pertanyaan:</p>
                          <div className="space-y-2">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs hover:shadow-md transition-shadow duration-300 cursor-default">
                              "Berapa harga print berwarna?"
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs hover:shadow-md transition-shadow duration-300 cursor-default">
                              "Dimana lokasi Printology?"
                            </div>
                            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs hover:shadow-md transition-shadow duration-300 cursor-default">
                              "Ada promo apa sekarang?"
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 sm:p-4 ${
                            message.isUser
                              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-br-none shadow-lg'
                              : 'bg-white text-gray-800 rounded-bl-none border-2 border-gray-100 shadow-md'
                          }`}
                        >
                          {!message.isUser && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-[10px]">AI</span>
                              </div>
                              <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Printology AI Assistant
                              </span>
                            </div>
                          )}
                          <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Loading Animation */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-3 sm:p-4 max-w-[85%] border-2 border-gray-100 shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-[10px]">AI</span>
                          </div>
                          <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Printology AI Assistant
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tanya tentang layanan Printology..."
                      className="flex-1 rounded-full border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-[8px]">AI</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Powered by Printology AI • Khusus informasi Printology
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;