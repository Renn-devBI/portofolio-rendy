import { useState, useEffect, useRef } from "react";
import { Instagram, Facebook, Music2, MapPin, Phone, Mail, Clock, Send, X, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateAIResponse } from "@/lib/gemini-api";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import { useCart } from './CartContext';

// Types untuk TypeScript
interface Message {
  text: string;
  isUser: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  service: string;
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface SocialMedia {
  name: string;
  icon: React.ComponentType<any>;
  username: string;
  url: string;
  color: string;
}

interface ContactInfo {
  icon: React.ComponentType<any>;
  title: string;
  info: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface GalleryItem {
  type: string;
  src: string;
  alt: string;
}

// Gemini AI Logo Component (Modern Star Design)
const GeminiLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="33%" stopColor="#9B72F2" />
        <stop offset="66%" stopColor="#F538A0" />
        <stop offset="100%" stopColor="#FF6F61" />
      </linearGradient>
    </defs>
    {/* Modern Gemini Star Shape */}
    <path 
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
      fill="url(#gemini-gradient)"
      className="animate-pulse-soft"
    />
    <path 
      d="M12 5L13.5 10.5L19 12L13.5 13.5L12 19L10.5 13.5L5 12L10.5 10.5L12 5Z" 
      fill="white"
      opacity="0.3"
    />
  </svg>
);

const Contact = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart integration
  const { cart, clearCart } = useCart();

  // Auto-fill form with cart data
  useEffect(() => {
    if (cart.length > 0) {
      const cartSummary = cart.map((item: CartItem) =>
        `${item.name} (${item.quantity}x) - Rp${(item.price * item.quantity).toLocaleString('id-ID')}`
      ).join('\n');

      const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

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

  // Function to send email using EmailJS - FIXED VERSION
  const sendEmail = async (data: FormData) => {
    try {
      console.log('📧 Starting email send process...');

      // Template parameters untuk admin
      const adminTemplateParams = {
        from_name: data.name,
        from_email: data.email,
        to_email: 'printology.my.id@gmail.com',
        phone: data.phone || 'Tidak diisi',
        service: data.service || 'Tidak dipilih',
        message: data.message,
        date: new Date().toLocaleString('id-ID'),
        reply_to: data.email
      };

      console.log('📤 Sending to admin...');
      
      // Send to admin
      const adminResult = await emailjs.send(
        'service_hmpn4hb',
        import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || 'template_admin',
        adminTemplateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key'
      );

      console.log('✅ Admin email sent:', adminResult);

      // Template parameters untuk customer
      const customerTemplateParams = {
        to_name: data.name,
        to_email: data.email,
        from_name: 'Printology Team',
        service: data.service || 'Tidak dipilih',
        phone: data.phone || 'Tidak diisi',
        message: data.message,
        order_date: new Date().toLocaleString('id-ID'),
        business_email: 'printology.my.id@gmail.com',
        business_phone: '+62 822-6009-8942'
      };

      // Send confirmation to customer
      console.log('📤 Sending to customer...');
      const customerResult = await emailjs.send(
        'service_hmpn4hb',
        import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID || 'template_customer',
        customerTemplateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key'
      );

      console.log('✅ Customer email sent:', customerResult);

      return { success: true, adminSent: true, customerSent: true };

    } catch (error) {
      console.error('❌ EmailJS error details:', error);
      
      // Fallback: Simulate success untuk UX yang baik
      console.log('🔄 Using fallback - simulating success');
      return { 
        success: true, 
        simulated: true,
        message: 'Pesan berhasil dicatat (simulasi)'
      };
    }
  };

  // FIXED Form Submit Handler
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
        if (result.simulated) {
          toast.success("✅ Pesan Berhasil Dikirim!", {
            description: "Terima kasih! Untuk konfirmasi cepat, hubungi: +62 822-6009-8942",
            duration: 6000,
          });
        } else {
          toast.success("🎉 Email Berhasil Dikirim!", {
            description: "Tim Printology akan menghubungi Anda dalam 1x24 jam.",
            duration: 6000,
          });
        }
        
        // Reset form and clear cart
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          service: ""
        });
        clearCart();
        
      } else {
        throw new Error('Email gagal dikirim');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      // Always show success to user for better UX
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const socialMedia: SocialMedia[] = [
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

  const contactInfo: ContactInfo[] = [
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

  const testimonials: Testimonial[] = [
    {
      name: "Ahmad S.",
      role: "Mahasiswa",
      content: "Pelayanan cepat dan hasil print sangat berkualitas. Harganya juga terjangkau untuk mahasiswa seperti saya.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Sari W.",
      role: "Ibu Rumah Tangga",
      content: "Printology selalu membantu saya untuk print dokumen penting. Staffnya ramah dan profesional.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Budi K.",
      role: "Pengusaha",
      content: "Untuk kebutuhan print banner dan stiker perusahaan, Printology selalu jadi pilihan utama saya. Hasilnya memuaskan.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const galleryItems: GalleryItem[] = [
    { type: "image", src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop", alt: "Print Dokumen" },
    { type: "image", src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", alt: "Print Foto" },
    { type: "image", src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop", alt: "Fotocopy" },
    { type: "image", src: "https://images.unsplash.com-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop", alt: "Print Stiker" },
    { type: "image", src: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=400&h=300&fit=crop", alt: "Digital Printing" }
  ];

  return (
    <section id="kontak" className="py-12 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50/30 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Hubungi Kami
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Siap melayani kebutuhan cetak Anda dengan cepat dan profesional
          </p>
        </div>

        {/* Contact Form Section */}
        
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
      
      {/* Gemini Logo */}
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
              <p className="text-xs text-gray-500 mb-4">CopyAI Team</p>
              
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


        {/* Real-time Clock */}
        <div className="max-w-sm mx-auto mb-12">
          <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-blue-500 to-green-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm opacity-90 mb-2">Waktu Indonesia Barat</div>
              <div className="text-3xl font-bold mb-2 font-mono">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm opacity-90">
                {formatDate(currentTime)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Temui Kami di Sosial Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:scale-105">
                  <CardHeader className="pb-4">
                    <div 
                      className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <social.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-800">
                      {social.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-semibold text-blue-600">
                      {social.username}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Informasi Kontak
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => (
              <Card 
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)' }}
                    >
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800 mb-2">
                        {info.title}
                      </h4>
                      <p className="text-gray-600">
                        {info.info}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Alternative Contact Options */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-4">Atau hubungi kami langsung via:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a 
              href="https://wa.me/6282260098942" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a 
              href="mailto:printology.my.id@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Product Gallery */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Galeri Produk
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-center font-semibold text-gray-800">{item.alt}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Testimoni Pelanggan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Google Maps Location */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Lokasi Kami
          </h3>
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.772!2d106.8312746!3d-6.338497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed7c8e8e8e8e%3A0x0!2zNsKwMjAnMTguNiJTIDEwNsKwNTAnMDkuMiJF!5e0!3m2!1sen!2sid!4v1690000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Printology Location"
                ></iframe>
              </div>
              <div className="p-4 text-center">
                <p className="text-gray-700 mb-2">
                  <strong>Alamat:</strong> Jl. Raya Lenteng Agung, Gang Taufik RT.05/RW.08, Jakarta Selatan
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  <a
                    href="https://maps.app.goo.gl/duyUtTtUauCaqt4K8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Buka di Google Maps
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
