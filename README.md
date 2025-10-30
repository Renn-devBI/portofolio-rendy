# Printology - Website Cetak Online

Website modern untuk jasa cetak Printology dengan fitur AI Assistant dan sistem pemesanan otomatis.

## 🚀 Fitur Utama

- ✨ AI Chat Assistant dengan Gemini AI
- 📧 Sistem Pemesanan dengan Email Otomatis
- 🖼️ Galeri Produk
- 💬 Testimoni Pelanggan
- 🗺️ Peta Lokasi Google Maps
- 📱 Responsive Design

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Email Configuration

1. Buat file `.env` di root directory (sudah tersedia template)
2. Konfigurasi email Gmail Anda:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**PENTING:** Untuk Gmail, gunakan "App Passwords" bukan password biasa:

1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Aktifkan 2-Factor Authentication
3. Generate App Password di Security > App passwords
4. Gunakan App Password tersebut di `EMAIL_PASS`

### 3. Jalankan Development Server

```bash
# Terminal 1: Jalankan backend server
npm run server

# Terminal 2: Jalankan frontend development server
npm run dev
```

Atau jalankan production build:

```bash
npm run build
npm start
```

## 📧 Sistem Email

Sistem email otomatis akan:

1. **Kirim email ke pelanggan** - Konfirmasi pemesanan
2. **Kirim email ke bisnis** (`rendywidjaya9@gmail.com`) - Detail pesanan lengkap
3. **Simpan data email** ke `database/email.json`

### Format Email

**Email ke Pelanggan:**
- Subjek: "Konfirmasi Pesanan - Printology"
- Isi: Terima kasih + detail pesanan + info kontak

**Email ke Bisnis:**
- Subjek: "Pesanan Baru dari [Nama] - Printology"
- Isi: Detail lengkap pesanan + waktu pemesanan

## 📁 Struktur Project

```
printology/
├── src/
│   ├── components/
│   │   └── printology/
│   │       └── Contact.tsx      # Komponen utama
│   └── lib/
│       └── gemini-api.ts        # API Gemini AI
├── server.js                    # Backend Express server
├── database/
│   └── email.json               # Database email
├── .env                         # Konfigurasi email
└── package.json
```

## 🔧 API Endpoints

### POST `/api/contact`
Mengirim formulir pemesanan dan mengirim email otomatis.

**Request Body:**
```json
{
  "name": "Nama Lengkap",
  "email": "user@example.com",
  "phone": "+628xxxxxxxxx",
  "service": "Print Dokumen",
  "message": "Detail pesanan..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pesanan berhasil dikirim!",
  "registrationTime": "Senin, 01 Januari 2024 10:00:00 WIB"
}
```

## 🎨 Fitur Frontend

- **AI Chat Bot**: Floating button dengan animasi modern
- **Form Pemesanan**: Validasi real-time, responsive
- **Galeri Produk**: 6 gambar produk dengan hover effects
- **Testimoni**: 3 testimoni pelanggan dengan rating
- **Google Maps**: Embed peta lokasi dengan link direct

## 📱 Responsive Design

Website fully responsive untuk:
- 📱 Mobile phones
- 📟 Tablets
- 💻 Desktops

## 🛡️ Keamanan

- Email validation
- CORS enabled
- Input sanitization
- Environment variables untuk credentials

## 📞 Kontak

- **Email**: printology.my.id@gmail.com
- **Phone**: +62 822-6009-8942
- **Alamat**: Jl. Raya Lenteng Agung, Gang Taufik RT.05/RW.08

---

**Printology** © 2024 - Jasa Cetak Modern dengan Teknologi AI
