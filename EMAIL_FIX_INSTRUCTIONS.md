# 🔧 EMAIL TEMPLATE FIX INSTRUCTIONS

## ❌ MASALAH YANG TERJADI
- Email customer mendapat error: "One or more dynamic variables are corrupted"
- Detail pesanan tidak muncul di email

## ✅ SOLUSI YANG SUDAH DIPERBAIKI

### 1. Kode Checkout.tsx sudah diperbaiki dengan:
- Format HTML untuk `order_details` yang kompatibel dengan EmailJS
- Parameter boolean untuk conditional rendering
- Debug logging untuk memudahkan troubleshooting

### 2. Template EmailJS yang sudah diperbaiki:

## 📧 ADMIN EMAIL TEMPLATE
Copy paste template berikut ke dashboard EmailJS → Templates → Template Admin Anda:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            max-width: 120px;
            margin-bottom: 15px;
            border-radius: 10px;
        }
        .content {
            padding: 30px;
        }
        .order-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        .info-item {
            background: white;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .badge {
            background: #28a745;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 10px;
        }
        .order-items {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            border: 1px solid #e9ecef;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f1f3f4;
        }
        .order-item:last-child {
            border-bottom: none;
        }
        .total-amount {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 15px 0;
            border: 2px solid #007bff;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.printology.my.id/og-image.png" alt="Printology Logo" class="logo">
            <h1>PESANAN BARU</h1>
            <p>Printology Customer Order</p>
        </div>

        <div class="content">
            <div class="badge">ORDER #{{order_id}}</div>
            <h2>Detail Pelanggan</h2>

            <div class="info-grid">
                <div class="info-item">
                    <strong>👤 Nama</strong><br>
                    {{from_name}}
                </div>
                <div class="info-item">
                    <strong>📧 Email</strong><br>
                    {{from_email}}
                </div>
                <div class="info-item">
                    <strong>📞 Telepon</strong><br>
                    {{phone}}
                </div>
                <div class="info-item">
                    <strong>📍 Alamat</strong><br>
                    {{address}}
                </div>
                <div class="info-item">
                    <strong>💳 Metode Bayar</strong><br>
                    {{payment_method}}
                </div>
                <div class="info-item">
                    <strong>📅 Waktu Order</strong><br>
                    {{order_date}}
                </div>
            </div>

            <div class="order-card">
                <h3>🛒 Detail Pesanan</h3>

                <div class="order-items">
                    <h4>Items:</h4>
                    {{{order_details}}}
                </div>

                <div class="total-amount">
                    <h3 style="margin: 0; color: #0056b3;">Total: {{total_amount}}</h3>
                </div>

                {{#if has_notes}}
                <div style="margin-top: 15px;">
                    <strong>📝 Catatan Tambahan:</strong><br>
                    {{notes}}
                </div>
                {{/if}}
            </div>

            <div style="background: #e7f3ff; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #0056b3;"> Tindakan Selanjutnya</h4>
                <p>Segera hubungi pelanggan untuk konfirmasi dan proses lebih lanjut.</p>
                <p><strong>Reply to:</strong> {{reply_to}}</p>
                <p><strong>Telepon:</strong> {{phone}}</p>
            </div>
        </div>

        <div class="footer">
            <p>© 2025 Printology. All rights reserved.<br>
            Jl. Raya Lenteng Agung No. 123, Jakarta</p>
        </div>
    </div>
</body>
</html>
```

## 📧 CUSTOMER EMAIL TEMPLATE
Copy paste template berikut ke dashboard EmailJS → Templates → Template Customer Anda:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            margin-bottom: 15px;
        }
        .content {
            padding: 30px;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .total {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            font-weight: bold;
            font-size: 18px;
        }
        .payment-info {
            background: #fff3cd;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #ffc107;
        }
        .cod-info {
            background: #d4edda;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #28a745;
        }
        .contact-info {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.printology.my.id/og-image.png" alt="Printology Logo" class="logo">
            <h1>✅ PESANAN DITERIMA</h1>
            <p>Printology Order Confirmation</p>
        </div>

        <div class="content">
            <h2>Halo {{to_name}}!</h2>
            <p>Terima kasih telah berbelanja di Printology. Pesanan Anda telah kami terima.</p>

            <h3>📦 Detail Pesanan</h3>
            <p><strong>Order ID:</strong> {{order_id}}</p>
            <p><strong>Tanggal:</strong> {{order_date}}</p>
            <p><strong>Metode Bayar:</strong> {{payment_method}}</p>
            <p><strong>Telepon:</strong> {{customer_phone}}</p>

            <h3>🛒 Items Pesanan:</h3>
            {{{order_details}}}

            <div class="total">
                Total Pembayaran: {{total_amount}}
            </div>

            {{#if payment_method_transfer}}
            <div class="payment-info">
                <h4>💳 Instruksi Transfer Bank:</h4>
                <p><strong>Bank:</strong> BCA (Bank Central Asia)</p>
                <p><strong>No. Rekening:</strong> 1234567890</p>
                <p><strong>Atas Nama:</strong> Printology</p>
                <p><strong>Jumlah Transfer:</strong> {{total_amount}}</p>
                <p style="margin-top: 10px; font-size: 14px; color: #856404;">
                    <strong>⚠️ Harap transfer tepat sesuai jumlah di atas</strong>
                </p>
            </div>
            {{/if}}

            {{#if payment_method_cod}}
            <div class="cod-info">
                <h4>💰 Pembayaran COD (Bayar di Tempat):</h4>
                <p><strong>Jumlah yang harus dibayar:</strong> {{total_amount}}</p>
                <p><strong>Cara Bayar:</strong> Bayar tunai saat barang diantar ke alamat Anda</p>
                <p style="margin-top: 10px; font-size: 14px; color: #155724;">
                    <strong>📦 Kurir kami akan menghubungi Anda untuk konfirmasi pengiriman</strong>
                </p>
            </div>
            {{/if}}

            {{#if customer_notes}}
            <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <strong>📝 Catatan Khusus:</strong><br>
                {{customer_notes}}
            </div>
            {{/if}}

            <div class="contact-info">
                <h4 style="margin-top: 0; color: #0056b3;">📞 Butuh Bantuan?</h4>
                <p><strong>WhatsApp:</strong> {{business_phone}}</p>
                <p><strong>Email:</strong> {{business_email}}</p>
                <p style="margin-top: 15px; font-size: 14px; color: #666;">
                    Tim kami akan menghubungi Anda dalam <strong>1x24 jam</strong> untuk konfirmasi lebih lanjut.
                </p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
                <div style="background: #28a745; color: white; padding: 12px 25px; border-radius: 25px; display: inline-block; font-weight: bold;">
                    🕒 Status: Menunggu Konfirmasi
                </div>
            </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px;">
            <p>© 2025 Printology. All rights reserved.<br>
            Melayani kebutuhan cetak Anda dengan kualitas terbaik</p>
        </div>
    </div>
</body>
</html>
```

## 🔧 LANGKAH-LANGKAH IMPLEMENTASI:

1. **Copy template Admin** ke EmailJS dashboard → Templates → Template Admin
2. **Copy template Customer** ke EmailJS dashboard → Templates → Template Customer  
3. **Test dengan melakukan pemesanan** di aplikasi
4. **Cek email** admin dan customer untuk memastikan detail pesanan muncul

## 📋 PARAMETER YANG DIKIRIM:

### Admin Email:
- `order_details`: HTML formatted list of items
- `has_notes`: Boolean untuk conditional notes
- `total_amount`, `order_id`, dll.

### Customer Email:
- `order_details`: HTML formatted list of items  
- `payment_method_transfer`: Boolean untuk transfer payment
- `payment_method_cod`: Boolean untuk COD payment
- `customer_notes`, `total_amount`, dll.

## ✅ HASIL YANG DIHARAPKAN:
- Detail pesanan muncul dengan format yang jelas
- Tidak ada lagi error "corrupted variables"
- Email tampil dengan styling yang menarik
- Conditional content berdasarkan metode pembayaran
