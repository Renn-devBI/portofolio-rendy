import { useState } from 'react';

const AdminNotification = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!title || !body) {
      setMessage('Title dan body harus diisi');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/send-admin-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Berhasil dikirim ke ${data.details.successCount} device`);
        setTitle('');
        setBody('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Gagal mengirim notifikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kirim Notifikasi Admin</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Judul Notifikasi</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan judul"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Isi Notifikasi</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Masukkan isi notifikasi"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Mengirim...' : 'Kirim Notifikasi'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AdminNotification;
