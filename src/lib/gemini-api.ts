const GOOGLE_AI_API_KEY = "AIzaSyA51fvOj3S63UkAa7aXojoh5t_HcEYP3S0";

// Daftar model yang akan dicoba
const MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash", 
  "gemini-1.5-pro",
  "gemini-pro"
];

const BASE_PROMPT = `🎨 IDENTITAS & TUJUAN:
Anda adalah AI Assistant resmi untuk **PRINTOLOGY**, layanan cetak dan fotokopi profesional dengan website lengkap.
Dikembangkan oleh **Kelompok 1 Kewirausahaan & UMKM Institut Bisnis dan Informatika Kosgoro 57**.
Tugas Anda adalah membantu pelanggan dengan ramah seputar **semua fungsi website Printology termasuk cara pembayaran dan bantuan pelanggan**.

👨‍💻 TIM PENGEMBANG & DEVOLOPER:
• Rendy Widjaya (05202540050)
• Muhammad Rafiantama (05202540089)
• Afdal Albani Aserih (05202540084)
• Ridwan Abdul Rozaq (05202540075)

📱 MEDIA SOSIAL:
• Instagram: @printology.id
• Facebook: @Printology.id
• TikTok: @printology

🏫 LATAR BELAKANG:
Printology dikembangkan sebagai proyek kewirausahaan mahasiswa IBIK 57 untuk mendukung layanan percetakan digital dan konvensional dengan website modern.

🎯 LAYANAN UTAMA:
• Fotokopi HVS 70gr: Rp500/lembar
• Print Hitam Putih: Rp1.000/lembar
• Print Berwarna: Rp2.000/lembar
• Cetak Foto 2R: Rp2.000/lembar
• Cetak Foto 3R: Rp3.000/lembar
• Cetak Foto 4R: Rp5.000/lembar
• Sticker Vinyl Custom: Rp4.000–Rp10.000
• Laminating Kartu: Rp2.000/kartu

🏢 INFORMASI BISNIS:
📍 Alamat: Jl. Raya Lenteng Agung No. 123, Jakarta LA
📞 Telepon: +62 822-6009-8942
📧 Email: printology.my.id@gmail.com
⏰ Jam Operasional: Senin–Sabtu, 08.00–20.00 WIB
🌐 Website: https://printology.my.id

💳 CARA PEMBAYARAN:
• Bayar di Tempat (COD): Pembayaran saat barang diantar
• Konfirmasi pembayaran via email atau telepon untuk memproses pesanan

🛒 FUNGSI WEBSITE:
• Keranjang Belanja Online: Tambah produk ke keranjang
• Checkout Otomatis: Form pengiriman dan pembayaran
• Konfirmasi Email: Otomatis kirim detail pesanan
• Chat AI Real-time: Bantuan instan 24/7
• Form Kontak: Kirim pesan dan inquiry
• Jam Real-time: Waktu Indonesia Barat
• Pemesanan Online: Order langsung dari website

🎉 PROMO & PENAWARAN:
• Diskon 10% untuk pemesanan di atas 50 lembar
• Gratis konsultasi desain untuk produk kustom
• Promo spesial via sosial media

📞 BANTUAN PELANGGAN:
• Chat AI di website untuk pertanyaan cepat
• Form kontak untuk inquiry detail
• Telepon/WhatsApp untuk konfirmasi urgent
• Email untuk follow-up pesanan
• Sosial media untuk update promo

⚠️ BATASAN:
- Jangan membahas hal di luar konteks layanan Printology.
- Jangan memberikan detail pribadi developer selain yang disebutkan.
- Jangan menjelaskan proses teknis internal sistem.
- Tidak perlu menjawab topik tentang kampus kecuali untuk konteks kewirausahaan proyek ini.

🧭 PEDOMAN RESPON:
1. Fokus pada semua fungsi website: layanan cetak, pembayaran, bantuan, pemesanan online.
2. Jelaskan cara menggunakan website, checkout, pembayaran, dan bantuan pelanggan.
3. Boleh memberikan saran ringan seputar file, desain, atau format yang cocok untuk dicetak.
4. Gunakan bahasa Indonesia yang sopan, ramah, dan mudah dipahami.
5. Jawaban maksimal 4–5 kalimat agar informatif namun tetap ringkas.
6. Jika pertanyaan di luar konteks, arahkan dengan sopan ke topik layanan Printology.
7. Berikan info pembayaran dan bantuan ketika relevan.

💬 RESPONS STANDAR UNTUK PERTANYAAN DI LUAR TOPIK:
"Maaf, saya hanya bisa membantu seputar layanan percetakan Printology. Apakah Anda ingin mengetahui cara pembayaran, bantuan pemesanan, atau info layanan cetak tertentu?"`;

// Fungsi untuk menghapus cache
export const clearAPICache = (): void => {
  try {
    // Hapus cache terkait Gemini API
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => {
          if (name.includes('gemini') || name.includes('google')) {
            caches.delete(name);
            console.log(`🗑️ Cache dihapus: ${name}`);
          }
        });
      });
    }
    
    // Hapus localStorage terkait (jika ada)
    Object.keys(localStorage).forEach(key => {
      if (key.includes('gemini') || key.includes('ai_response')) {
        localStorage.removeItem(key);
        console.log(`🗑️ LocalStorage dihapus: ${key}`);
      }
    });
    
    console.log("✅ Cache berhasil dibersihkan");
  } catch (error) {
    console.warn("⚠️ Gagal membersihkan cache:", error);
  }
};

// Fungsi untuk delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Global rate limiting prevention
let lastApiCallTime = 0;
const MIN_TIME_BETWEEN_CALLS = 1000; // Minimal 1 detik antar API call

const enforceGlobalRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;

  if (timeSinceLastCall < MIN_TIME_BETWEEN_CALLS) {
    const waitTime = MIN_TIME_BETWEEN_CALLS - timeSinceLastCall;
    console.log(`🌐 Global rate limit: waiting ${waitTime}ms before next API call...`);
    await sleep(waitTime);
  }

  lastApiCallTime = Date.now();
};

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  const MAX_RETRIES_PER_MODEL = 2;
  const RETRY_DELAY = 1500; // Ditingkatkan dari 1000ms ke 1500ms
  const MODEL_SWITCH_DELAY = 2000; // Delay 2 detik saat ganti model

  let lastError = null;

  // Coba setiap model secara berurutan
  for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
    const currentModel = MODELS[modelIndex];

    // Jika bukan model pertama, beri delay sebelum switch
    if (modelIndex > 0) {
      console.log(`⏳ Switching to next model in ${MODEL_SWITCH_DELAY}ms...`);
      await sleep(MODEL_SWITCH_DELAY);
    }

    for (let attempt = 1; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
      try {
        console.log(`🔄 Model: ${currentModel}, Attempt ${attempt}/${MAX_RETRIES_PER_MODEL}`);

        // Enforce global rate limiting
        await enforceGlobalRateLimit();

        // Minimal delay sebelum setiap request untuk menghindari rate limiting
        const minDelay = attempt === 1 ? 500 : RETRY_DELAY * attempt;
        console.log(`⏳ Waiting ${minDelay}ms before request...`);
        await sleep(minDelay);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${GOOGLE_AI_API_KEY}`;
        
        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${BASE_PROMPT}\n\nPelanggan: ${userMessage}\nAssistant:`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150
          }
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: 'no-store'
        });

        console.log("📡 Response status:", response.status);

        // Handle rate limiting errors (429) - tambah delay lebih lama
        if (response.status === 429) {
        console.warn(`⚠️ Rate limited on ${currentModel}, waiting longer...`);
        await sleep(5000); // Wait 5 seconds for rate limit
        lastError = new Error(`Rate limited on ${currentModel}`);
        continue; // Retry with same model after longer delay
        }

        // Handle overload error (503) - langsung ganti model
        if (response.status === 503) {
          console.warn(`⚠️ Model ${currentModel} overloaded, switching to next model...`);
          // Hapus cache saat terjadi overload
          clearAPICache();
          lastError = new Error(`Model ${currentModel} overloaded`);
          break; // Keluar dari loop attempt, lanjut ke model berikutnya
        }

        // Handle quota exceeded (403/402)
        if (response.status === 403 || response.status === 402) {
          console.warn(`⚠️ Quota exceeded for ${currentModel}, switching to next model...`);
          lastError = new Error(`Quota exceeded for ${currentModel}`);
          break; // Keluar dari loop attempt, lanjut ke model berikutnya
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiResponse) {
          console.log(`✅ Success with model ${currentModel}`);
          return aiResponse.trim();
        } else {
          throw new Error("Invalid response from AI");
        }
        
      } catch (error) {
        console.error(`💥 Error with model ${currentModel} (Attempt ${attempt}):`, error);
        lastError = error;
        
        // Jika ini attempt terakhir untuk model ini, lanjut ke model berikutnya
        if (attempt === MAX_RETRIES_PER_MODEL) {
          console.log(`➡️ Moving to next model...`);
          break;
        }
        
        // Tunggu sebelum retry dengan model yang sama
        await sleep(RETRY_DELAY * attempt);
      }
    }
  }

  // Jika semua model gagal
  throw new Error("Semua model AI sedang mengalami kendala. Silakan refresh halaman dan coba lagi.");
};
