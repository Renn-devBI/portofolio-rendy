import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, CheckCircle, CreditCard, MapPin, Phone, Mail, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Invoice = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    // Load order data from localStorage
    const orders = JSON.parse(localStorage.getItem('printology_orders') || '[]');
    const order = orders.find((o: any) => o.orderId === orderId);

    if (!order) {
      navigate('/');
      return;
    }

    setOrderData(order);
  }, [orderId, navigate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Invoice Tidak Ditemukan</h1>
              <p className="text-gray-600">Order ID tidak valid atau invoice telah kedaluwarsa.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Kembali ke Beranda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10 rounded-xl hover:bg-blue-100 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Invoice Pesanan
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">Order ID: {orderData.orderId}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Cetak
                </Button>
                <Button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Info */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Printology Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Informasi Pesanan</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Order ID:</strong> {orderData.orderId}</p>
                      <p><strong>Tanggal:</strong> {orderData.orderDate}</p>
                      <p><strong>Status:</strong>
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          {orderData.status === 'pending' ? 'Menunggu Pembayaran' : orderData.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Informasi Customer</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nama:</strong> {orderData.customer.name}</p>
                      <p><strong>Email:</strong> {orderData.customer.email}</p>
                      <p><strong>Telepon:</strong> {orderData.customer.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Detail Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.quantity}x @ {formatCurrency(item.price)}</p>
                      </div>
                      <p className="font-bold text-blue-600">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {orderData.customer.notes && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Catatan Pesanan:</h4>
                    <p className="text-sm text-gray-700">{orderData.customer.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">{orderData.customer.name}</p>
                  <p className="whitespace-pre-wrap">{orderData.customer.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl sticky top-6">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Ringkasan Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(orderData.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pengiriman:</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-indigo-600">{formatCurrency(orderData.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Metode Pembayaran</h4>
                  <p className="text-sm text-gray-700">{orderData.paymentMethod}</p>
                  {orderData.paymentMethod === 'Transfer Bank' && (
                    <div className="mt-2 text-xs text-gray-600">
                      <p><strong>BCA:</strong> 1234567890</p>
                      <p><strong>a.n:</strong> Printology</p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Status Pembayaran</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Menunggu Pembayaran</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Butuh Bantuan?</h4>
                  <div className="space-y-2 text-sm">
                    <a href="tel:+6282260098942" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <Phone className="h-4 w-4" />
                      +62 822-6009-8942
                    </a>
                    <a href="mailto:printology.my.id@gmail.com" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <Mail className="h-4 w-4" />
                      printology.my.id@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Terima kasih telah memilih Printology untuk kebutuhan cetak Anda!</p>
          <p className="mt-1">Invoice ini sah dan dapat digunakan sebagai bukti pembayaran.</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
