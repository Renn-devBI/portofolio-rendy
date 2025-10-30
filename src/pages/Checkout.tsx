import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, CheckCircle, Clock, MapPin, Phone, Mail, ShoppingBag, Sparkles, Shield, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/printology/CartContext";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "transfer"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const generateOrderId = () => {
    return `PRINT-${Date.now().toString().slice(-8)}`;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nama lengkap harus diisi");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email harus diisi");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Nomor telepon harus diisi");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Alamat lengkap harus diisi");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Format email tidak valid");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const orderDate = new Date().toLocaleString('id-ID');
      const total = getTotal();

      // Format order details untuk email admin
      const orderDetailsHTML = cart.map(item => 
        `<div class="order-item">
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-details">${item.quantity}x @ ${formatCurrency(item.price)}</div>
          </div>
          <div class="item-price">${formatCurrency(item.price * item.quantity)}</div>
        </div>`
      ).join('');

      // Format order details untuk customer (lebih sederhana)
      const customerOrderDetails = cart.map(item => 
        `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f3f4;">
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.quantity}x @ ${formatCurrency(item.price)}</small>
          </div>
          <div style="font-weight: bold; color: #007bff;">
            ${formatCurrency(item.price * item.quantity)}
          </div>
        </div>`
      ).join('');

      // Parameter untuk email admin
      const adminParams = {
        to_email: import.meta.env.VITE_EMAILJS_BUSINESS_EMAIL,
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes || 'Tidak ada catatan',
        payment_method: formData.paymentMethod === 'transfer' ? 'Transfer Bank' : 'COD (Bayar di Tempat)',
        order_id: orderId,
        order_date: orderDate,
        order_details: orderDetailsHTML,
        total_amount: formatCurrency(total),
        reply_to: formData.email,
        // Parameter boolean untuk conditional rendering EmailJS
        has_notes: formData.notes && formData.notes.trim() !== ''
      };

      console.log('Admin email parameters:', adminParams);

      // Send email to admin
      const adminResult = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
        adminParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log('Admin email result:', adminResult);

      // Parameter untuk email customer - KOMPATIBEL DENGAN EMAILJS
      const customerParams = {
        to_name: formData.name,
        to_email: formData.email,
        order_id: orderId,
        order_date: orderDate,
        order_details: customerOrderDetails,
        total_amount: formatCurrency(total),
        payment_method: formData.paymentMethod === 'transfer' ? 'Transfer Bank' : 'COD',
        customer_phone: formData.phone,
        customer_notes: formData.notes || 'Tidak ada catatan',
        business_phone: '+62 822-6009-8942',
        business_email: 'printology.my.id@gmail.com',
        // Parameter boolean untuk conditional rendering EmailJS
        payment_method_transfer: formData.paymentMethod === 'transfer',
        payment_method_cod: formData.paymentMethod === 'cod'
      };

      console.log('Customer email parameters:', customerParams);

      // Send confirmation to customer
      const customerResult = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
        customerParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log('Customer email result:', customerResult);

      // Save order data for invoice
      const orderData = {
        orderId,
        orderDate,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes
        },
        items: cart,
        paymentMethod: formData.paymentMethod === 'transfer' ? 'Transfer Bank' : 'COD',
        total: total,
        status: 'pending'
      };

      // Save to localStorage for invoice access
      const existingOrders = JSON.parse(localStorage.getItem('printology_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('printology_orders', JSON.stringify(existingOrders));

      clearCart();
      setCompletedOrderId(orderId);
      setOrderPlaced(true);

      toast.success("🎉 Pesanan berhasil dibuat!", {
        description: `Order ID: ${orderId}. Cek email untuk detail pembayaran.`,
        duration: 6000,
      });

    } catch (error: any) {
      console.error('❌ Order submission failed:', error);
      toast.error("Gagal membuat pesanan", {
        description: error?.message || "Silakan coba lagi atau hubungi customer service",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (rest of the component remains the same)
  // Success & Empty Cart states
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8">
              <div className="text-center text-white">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h1 className="text-4xl font-bold mb-2">Pesanan Berhasil! 🎉</h1>
                <p className="text-green-50 text-lg">Terima kasih atas kepercayaan Anda</p>
              </div>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Pesanan Anda telah berhasil dibuat dan konfirmasi telah dikirim ke email Anda.
                </p>
                <p className="text-gray-600">
                  Tim kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.
                </p>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={() => navigate(`/invoice?orderId=${completedOrderId}`)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-12 text-base font-semibold"
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Cetak Invoice
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold"
                >
                  Kembali ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-800">Keranjang Kosong</h1>
                <p className="text-gray-600 text-lg">Tambahkan produk ke keranjang terlebih dahulu</p>
              </div>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-base font-semibold"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Kembali Belanja
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl hover:bg-blue-100 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                    Checkout Pesanan
                  </h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Lengkapi data untuk menyelesaikan pesanan Anda</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Customer Information - Left Side (2/3 width) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Informasi Pengiriman */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                  Informasi Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmitOrder} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        className="h-12 border-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        className="h-12 border-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      No. Telepon <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+62 xxx-xxxx-xxxx"
                      className="h-12 border-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Masukkan alamat lengkap pengiriman (Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan, Kota)"
                      className="min-h-[100px] border-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-vertical text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Catatan Tambahan
                    </label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Warna khusus, ukuran, instruksi khusus, dll (opsional)"
                      className="min-h-[80px] border-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-vertical text-base"
                    />
                  </div>

                  {/* Metode Pembayaran */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Metode Pembayaran <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <label className="group block cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="transfer"
                          checked={formData.paymentMethod === 'transfer'}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <div className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.paymentMethod === 'transfer'
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              formData.paymentMethod === 'transfer'
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.paymentMethod === 'transfer' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-sm sm:text-base">🏦 Transfer Bank</p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">BCA: 1234567890 a.n Printology</p>
                            </div>
                          </div>
                        </div>
                      </label>

                      <label className="group block cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <div className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.paymentMethod === 'cod'
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              formData.paymentMethod === 'cod'
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.paymentMethod === 'cod' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-sm sm:text-base">💰 Bayar di Tempat</p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">Bayar saat barang diantar</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white h-12 sm:h-14 text-base sm:text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 mr-2 animate-spin" />
                        Memproses Pesanan...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                        Buat Pesanan - {formatCurrency(total)}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 pt-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Pesanan Anda dijamin aman dan terenkripsi</span>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Phone className="h-5 w-5" />
                  Butuh Bantuan?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <a href="tel:+6282260098942" className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">Telepon</p>
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">+62 822-6009-8942</p>
                    </div>
                  </a>

                  <a href="mailto:printology.my.id@gmail.com" className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">Email</p>
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">printology.my.id@gmail.com</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right Side (1/3 width) */}
          <div className="xl:col-span-1">
            <Card className="border-0 shadow-xl overflow-hidden sticky top-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base mb-1 truncate">{item.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {item.quantity}x @ {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-blue-600 whitespace-nowrap text-sm sm:text-base">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-dashed pt-4 mt-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-5 text-white shadow-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm opacity-90 mb-1">Total Pembayaran</p>
                        <p className="text-2xl sm:text-3xl font-bold truncate">{formatCurrency(total)}</p>
                      </div>
                      <CreditCard className="h-8 w-8 sm:h-12 sm:w-12 opacity-50 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;