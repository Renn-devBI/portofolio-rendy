# Firebase Setup untuk Printology Notifications

## Persyaratan

Pastikan Firebase project Anda memiliki:
1. **Realtime Database** - Enabled
2. **Firebase Cloud Messaging (FCM)** - Enabled
3. **Service Account Key** - Downloaded sebagai JSON

## Setup Files

### 1. serviceAccountKey.json (Wajib)
- Download dari Firebase Console > Project Settings > Service Accounts
- Generate new private key
- Simpan sebagai `api/serviceAccountKey.json`

### 2. .env (Opsional - sudah tidak diperlukan jika menggunakan serviceAccountKey.json)
Environment variables untuk client-side Firebase:

```env
# Firebase Web App Configuration
VITE_FIREBASE_API_KEY=your_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# FCM VAPID Key - untuk push notifications
VITE_FCM_VAPID_KEY=your_vapid_key_from_firebase_console
```

## Testing Setup

1. Jalankan `npm run dev`
2. Buka http://localhost:5080/admin
3. Login dengan credentials admin
4. Klik "Test Firebase Connection" untuk memverifikasi setup

## Cara Kerja Notifications

1. **Client-side**: User memberikan permission notifikasi saat pertama kali akses
2. **FCM Token**: Token didaftarkan ke Firebase Realtime Database
3. **Admin Send**: Admin mengirim notifikasi melalui panel admin
4. **Server**: Notifikasi disimpan ke database dan dikirim via FCM ke semua tokens
5. **Client Receive**: Push notification muncul + banner di website

## Troubleshooting

### Error: "Gagal mengirim notifikasi"
- Pastikan `serviceAccountKey.json` ada dan valid
- Periksa Firebase Console bahwa Realtime Database enabled
- Test dengan "Test Firebase Connection" di admin panel

### Notifications tidak muncul
- Pastikan user sudah memberikan permission notifikasi
- Periksa browser console untuk error FCM
- Pastikan service worker terdaftar dengan benar

### Modal permission hilang terlalu cepat
- Sudah diperbaiki dengan delay 100ms pada permission check
- Modal akan muncul setelah permission status terdeteksi
