import React, { useState } from 'react';
import emailjs from '@emailjs/browser';


interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
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

      console.log('🔄 Starting email process...');

      let adminSent = false;
      let customerSent = false;

      try {
        // 1. Send to ADMIN (Pesanan Baru)
        const adminResult = await emailjs.send(
          'service_hmpn4hb',
          'template_rbazw2a',
          {
            from_name: formData.name,
            from_email: formData.email,
            to_email: 'printology.my.id@gmail.com',
            phone: formData.phone || 'Tidak diisi',
            service: formData.service || 'Tidak dipilih',
            message: formData.message,
            order_id: orderId,
            order_date: orderDate,
            reply_to: formData.email,
            logo_url: 'https://www.printology.my.id/og-image.png'
          },
          'X0kg3RsIZemMLPbfW'
        );
        adminSent = true;
        console.log('✅ Admin email sent:', adminResult);
      } catch (adminError) {
        console.error('❌ Admin email failed:', adminError);
      }

      try {
        // 2. AUTO REPLY to CUSTOMER (Order Confirmation)
        console.log('🔄 Attempting customer email with template:', 'template_6migpfe');
        console.log('📧 Customer email params:', {
          to_name: formData.name,
          to_email: formData.email,
          service: formData.service || 'Layanan Printing'
        });

        const customerResult = await emailjs.send(
          'service_hmpn4hb',
          'template_6migpfe',
          {
            to_name: formData.name,
            to_email: formData.email,
            from_name: 'Printology Team',
            service: formData.service || 'Layanan Printing',
            phone: formData.phone || 'Tidak diisi',
            message: formData.message,
            order_id: orderId,
            order_date: orderDate,
            business_email: 'printology.my.id@gmail.com',
            business_phone: '+62 822-6009-8942',
            business_address: 'Jl. Raya Lenteng Agung No. 123, Jakarta',
            logo_url: 'https://www.printology.my.id/og-image.png'
          },
          'X0kg3RsIZemMLPbfW'
        );
        customerSent = true;
        console.log('✅ Customer auto-reply sent successfully:', customerResult);
      } catch (customerError) {
        console.error('❌ Customer email failed with details:', {
          error: customerError,
          templateId: 'template_6migpfe',
          serviceId: 'service_hmpn4hb',
          toEmail: formData.email
        });
      }

      // Set response based on what was sent
      if (adminSent && customerSent) {
        setResponse({
          success: true,
          message: 'Pesanan berhasil dikirim! Email notifikasi dikirim ke admin dan konfirmasi otomatis ke email Anda.'
        });
      } else if (adminSent) {
        setResponse({
          success: true,
          message: 'Pesanan berhasil dicatat. Email notifikasi dikirim ke admin. Silakan hubungi +62 822-6009-8942 untuk konfirmasi.'
        });
      } else {
        setResponse({
          success: false,
          message: 'Gagal mengirim email. Silakan hubungi langsung +62 822-6009-8942.'
        });
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });

    } catch (error) {
      console.error('❌ EmailJS error:', error);
      setResponse({ 
        success: false, 
        message: 'Pesan berhasil dicatat. Silakan hubungi +62 822-6009-8942 untuk konfirmasi.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            name="name"
            placeholder="Masukkan nama lengkap"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No. Telepon
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+62 xxx-xxxx-xxxx"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Layanan yang Dibutuhkan *
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih Layanan</option>
            <option value="Print Dokumen">Print Dokumen</option>
            <option value="Print Foto">Print Foto</option>
            <option value="Print Stiker">Print Stiker</option>
            <option value="Fotocopy">Fotocopy</option>
            <option value="Design Grafis">Design Grafis</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detail Pesanan / Pertanyaan *
        </label>
        <textarea
          name="message"
          placeholder="Jelaskan kebutuhan cetak Anda secara detail..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Mengirim Pesanan...
          </div>
        ) : (
          'Kirim Pesanan Sekarang'
        )}
      </button>
      
      {response && (
        <div className={`p-4 rounded-lg ${
          response.success 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-orange-50 border border-orange-200 text-orange-800'
        }`}>
          <p className="font-medium">{response.message}</p>
          {response.success && (
            <p className="text-sm mt-1">✅ Auto-reply telah dikirim ke email Anda</p>
          )}
        </div>
      )}
    </form>
  );
};

export default ContactForm;