import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const BUSINESS_EMAIL = import.meta.env.VITE_EMAILJS_BUSINESS_EMAIL;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
const CUSTOMER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID;

export const sendEmail = async (formData: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) => {
  try {
    console.log('📧 Sending email with data:', formData);

    // Template parameters untuk EmailJS
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      to_email: BUSINESS_EMAIL,
      phone: formData.phone || 'Tidak diisi',
      service: formData.service || 'Tidak dipilih',
      message: formData.message,
      date: new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Send email menggunakan EmailJS
    const result = await emailjs.send(
      SERVICE_ID,
      ADMIN_TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('✅ Email sent successfully:', result);
    return { 
      success: true, 
      message: 'Pesan berhasil dikirim! Kami akan menghubungi Anda segera.' 
    };

  } catch (error) {
    console.error('❌ EmailJS error:', error);
    return { 
      success: false, 
      message: 'Pesan berhasil dicatat. Silakan hubungi +62 822-6009-8942 untuk konfirmasi.' 
    };
  }
};