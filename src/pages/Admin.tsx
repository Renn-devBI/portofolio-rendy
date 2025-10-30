// pages/Admin.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Home, Bell, Trash2, Users, Send, Clock, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  message: string;
  duration: number;
  timestamp: number;
  fadeOutDuration: number;
}

interface NotificationHistory {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
}

const Admin = () => {
  console.log('Admin component rendered');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(5);
  const [fadeOutDuration, setFadeOutDuration] = useState(3);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const ADMIN_USERNAME = 'admin_printology';
  const ADMIN_PASSWORD_HASH = 'cHJpbnRvbG9neV9pYmlr';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const storedHistory = localStorage.getItem('printology_notification_history');
      if (storedHistory) {
        setNotificationHistory(JSON.parse(storedHistory));
      }
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && btoa(password) === ADMIN_PASSWORD_HASH) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Username atau password salah');
    }
  };

  const handleSetNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    if (!message.trim()) {
      setSuccess('Pesan tidak boleh kosong');
      setLoading(false);
      return;
    }
    if (duration <= 0 || fadeOutDuration <= 0) {
      setSuccess('Durasi dan fade-out harus lebih dari 0');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_NOTIF_SERVER || 'https://notifikasi-server.vercel.app'}/api/save-admin-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          duration,
          fadeOutDuration,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const historyItem: NotificationHistory = {
          id: data.notification.id,
          message: data.notification.message,
          timestamp: data.notification.timestamp,
          read: false
        };

        const updatedHistory = [historyItem, ...notificationHistory].slice(0, 10);
        setNotificationHistory(updatedHistory);
        localStorage.setItem('printology_notification_history', JSON.stringify(updatedHistory));

        window.dispatchEvent(new CustomEvent('notificationUpdated'));

        setSuccess('Notifikasi berhasil dikirim ke semua user!');
        setMessage('');
        setDuration(5);
        setFadeOutDuration(3);
      } else {
        setSuccess('Error: Unknown');
      }
    } catch (error) {
      setSuccess('Gagal mengirim notifikasi');
      console.error('Error sending notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const clearNotificationHistory = () => {
    setNotificationHistory([]);
    localStorage.removeItem('printology_notification_history');
    setSuccess('History notifikasi berhasil direset!');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
              <Bell className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
            <CardDescription className="text-lg">Masuk ke panel admin Printology</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 text-base focus:ring-2 focus:ring-blue-500 border-2 rounded-xl"
                  placeholder="Masukkan username"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base focus:ring-2 focus:ring-blue-500 border-2 rounded-xl"
                  placeholder="Masukkan password"
                />
              </div>
              {loginError && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg transition-all duration-200"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Panel kontrol Printology</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="outline" 
              className="flex items-center gap-2 rounded-xl border-2"
            >
              <Home className="h-4 w-4" />
              {!isMobile && 'Home'}
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="rounded-xl border-2"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Total Notifikasi</p>
                      <p className="text-3xl font-bold">{notificationHistory.length}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <Bell className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Notifikasi Aktif</p>
                      <p className="text-3xl font-bold">
                        {notificationHistory.filter(n => !n.read).length}
                      </p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Status Sistem</p>
                      <p className="text-xl font-bold">Online</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Device Type</p>
                      <p className="text-xl font-bold">{isMobile ? 'Mobile' : 'Desktop'}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <Smartphone className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  Kirim Notifikasi
                </CardTitle>
                <CardDescription className="text-base">
                  Buat notifikasi yang akan tampil di website dan dikirim sebagai push notification ke semua device terdaftar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSetNotification} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label htmlFor="message" className="text-base font-medium">Pesan Notifikasi</Label>
                      <Input
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Contoh: Hari ini ada promo spesial!"
                        required
                        className="h-14 text-base rounded-xl border-2 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <Label htmlFor="duration" className="text-base font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Durasi (menit)
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          max="1440"
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          required
                          className="h-14 text-base rounded-xl border-2 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="fadeOutDuration" className="text-base font-medium">Fade-out (detik)</Label>
                        <Input
                          id="fadeOutDuration"
                          type="number"
                          min="1"
                          max="60"
                          value={fadeOutDuration}
                          onChange={(e) => setFadeOutDuration(Number(e.target.value))}
                          required
                          className="h-14 text-base rounded-xl border-2 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {success && (
                    <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <AlertDescription className="text-green-800 text-base">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-14 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg flex-1"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Mengirim...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Kirim Notifikasi
                        </div>
                      )}
                    </Button>

                    {notificationHistory.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearNotificationHistory}
                        className="h-14 text-base rounded-xl border-2 flex items-center gap-2"
                      >
                        <Trash2 className="h-5 w-5" />
                        {!isMobile && 'Reset History'}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-xl">
                  <span>History Notifikasi</span>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {notificationHistory.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Riwayat notifikasi terbaru
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notificationHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 space-y-4">
                    <Bell className="h-16 w-16 mx-auto opacity-50" />
                    <p className="text-lg">Belum ada notifikasi</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {notificationHistory.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          !notification.read
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-base font-medium flex-1 leading-relaxed">
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {formatTime(notification.timestamp)}
                          </span>
                          <Badge 
                            variant={!notification.read ? "default" : "outline"} 
                            className="text-xs px-2 py-1"
                          >
                            {!notification.read ? 'Baru' : 'Dibaca'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
