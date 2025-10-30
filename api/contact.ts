import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import moment from 'moment-timezone';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Utility functions
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const getIndonesianTime = () => {
    return moment().tz('Asia/Jakarta').format('dddd, DD MMMM YYYY HH:mm:ss z');
};

const saveEmailToJson = (email) => {
    const dbPath = path.join(__dirname, '..', 'database', 'email.json');
    let emailData = [];
    if (!fs.existsSync(path.dirname(dbPath))) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    if (fs.existsSync(dbPath)) {
        try {
            emailData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        } catch (error) {
            console.error('Error reading email.json:', error);
        }
    }
    const existingEmail = emailData.find(data => data.email === email);
    if (!existingEmail) {
        emailData.push({
            email: email,
            registrationTime: getIndonesianTime(),
            timestamp: new Date().toISOString()
        });
        fs.writeFileSync(dbPath, JSON.stringify(emailData, null, 2));
    }
    return getIndonesianTime();
};

export default async function handler(req: any, res: any): Promise<void> {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        console.log('📧 Received contact form submission:', req.body);

        const { name, email, phone, service, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Nama, email, dan pesan wajib diisi'
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            console.log('❌ Validation failed: Invalid email format');
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }

        // Save email to database
        const registrationTime = saveEmailToJson(email);
        console.log('💾 Email saved to database');

        // Email content for business owner
        const businessEmailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Pesanan Baru dari Printology</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Detail Pesanan:</h3>
                    <p><strong>Nama:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Telepon:</strong> ${phone || 'Tidak diisi'}</p>
                    <p><strong>Layanan:</strong> ${service || 'Tidak dipilih'}</p>
                    <p><strong>Pesan:</strong></p>
                    <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <p><strong>Waktu Pemesanan:</strong> ${getIndonesianTime()}</p>
                </div>
                <p style="color: #64748b; font-size: 14px;">
                    Silakan hubungi pelanggan secepatnya untuk konfirmasi pesanan.
                </p>
            </div>
        `;

        // Email content for customer
        const customerEmailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Terima Kasih atas Pesanan Anda!</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p>Halo <strong>${name}</strong>,</p>
                    <p>Terima kasih telah menghubungi Printology. Kami telah menerima pesanan Anda dengan detail sebagai berikut:</p>
                    <ul>
                        <li><strong>Layanan:</strong> ${service || 'Tidak dipilih'}</li>
                        <li><strong>Waktu Pemesanan:</strong> ${getIndonesianTime()}</li>
                    </ul>
                    <p>Kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut. Jika ada pertanyaan, silakan hubungi kami di:</p>
                    <ul>
                        <li>📞 +62 822-6009-8942</li>
                        <li>📧 printology.my.id@gmail.com</li>
                    </ul>
                </div>
                <p style="color: #64748b; font-size: 14px;">
                    Hormat kami,<br>
                    Tim Printology
                </p>
            </div>
        `;

        console.log('📤 Sending email to business owner...');
        // Send email to business owner
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'printology.my.id@gmail.com',
            subject: `Pesanan Baru dari ${name} - Printology`,
            html: businessEmailContent
        });
        console.log('✅ Email sent to business owner');

        console.log('📤 Sending confirmation email to customer...');
        // Send confirmation email to customer
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Konfirmasi Pesanan - Printology',
            html: customerEmailContent
        });
        console.log('✅ Confirmation email sent to customer');

        res.status(200).json({
            success: true,
            message: 'Pesanan berhasil dikirim! Kami akan segera menghubungi Anda.',
            registrationTime: registrationTime
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({
            success: false,
            message: `Terjadi kesalahan saat mengirim pesanan: ${error.message}`
        });
    }
}
