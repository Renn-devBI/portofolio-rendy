// api/contact.ts - Untuk Vite/React, bukan Next.js
import { sendEmail } from './send-email';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export const handleContactSubmit = async (formData: ContactFormData) => {
  try {
    console.log('📝 Processing contact form:', formData);

    // Validasi dasar
    if (!formData.name?.trim()) {
      throw new Error('Nama lengkap harus diisi');
    }
    if (!formData.email?.trim()) {
      throw new Error('Email harus diisi');
    }
    if (!formData.message?.trim()) {
      throw new Error('Pesan harus diisi');
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Format email tidak valid');
    }

    // Kirim email menggunakan EmailJS
    const result = await sendEmail(formData);
    
    return result;

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Terjadi kesalahan saat mengirim pesan';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};