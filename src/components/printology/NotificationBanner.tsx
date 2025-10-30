// components/printology/NotificationBanner.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { messaging } from '../../firebase';
import { getToken, onMessage } from 'firebase/messaging';

interface Notification {
  id: string;
  message: string;
  duration: number;
  timestamp: number;
  fadeOutDuration: number;
}

const NotificationBanner = () => {
  const location = useLocation();
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('checking');
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);
  const [processedNotifications, setProcessedNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkNotification = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_NOTIF_SERVER || 'https://notifikasi-server.vercel.app'}/api/get-latest-notification`);
        const data = await response.json();

        if (data.success && data.notification) {
          const notif: Notification = data.notification;
          const now = Date.now();
          const expiry = notif.timestamp + (notif.duration * 60 * 1000);

          if (now < expiry) {
            // Cek apakah notifikasi sudah diproses
            if (processedNotifications.has(notif.id)) {
              return;
            }

            let shownNotifications: string[] = [];
            try {
              shownNotifications = JSON.parse(localStorage.getItem('shown_notifications') || '[]');
            } catch (error) {
              shownNotifications = [];
            }

            const isAlreadyShown = shownNotifications.includes(notif.id);
            const isCurrentlyActive = activeNotificationId === notif.id;

            if (isAlreadyShown || isCurrentlyActive) {
              return;
            }

            // Tandai sebagai sudah diproses
            setProcessedNotifications(prev => new Set([...prev, notif.id]));
            setActiveNotificationId(notif.id);
            setCurrentNotification(notif);
            setIsVisible(true);

            // Simpan ke shown notifications
            const updatedShownNotifications = [...shownNotifications, notif.id].slice(-10);
            localStorage.setItem('shown_notifications', JSON.stringify(updatedShownNotifications));

            // Hanya tampilkan toast sekali
            setTimeout(() => {
              toast(notif.message, {
                description: "Notifikasi dari Printology Dev",
                duration: notif.fadeOutDuration * 1000,
                className: "bg-gradient-to-r from-green-400 to-blue-500 text-white border-none",
                position: "bottom-left",
              });
            }, 5000);

            // Simpan ke history (hanya sekali)
            const storedHistory = localStorage.getItem('printology_notification_history');
            const history = storedHistory ? JSON.parse(storedHistory) : [];

            // Cek apakah sudah ada di history
            const alreadyInHistory = history.some((item: any) => item.id === notif.id);
            if (!alreadyInHistory) {
              const historyItem = {
                id: notif.id,
                message: notif.message,
                timestamp: notif.timestamp,
                read: false
              };

              const updatedHistory = [historyItem, ...history].slice(0, 10);
              localStorage.setItem('printology_notification_history', JSON.stringify(updatedHistory));

              // Trigger event untuk update Navigation
              window.dispatchEvent(new CustomEvent('notificationUpdated'));
            }

            // Auto hide banner
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(() => {
                setActiveNotificationId(null);
              }, 1000);
            }, notif.fadeOutDuration * 1000);
          }
        }
      } catch (error) {
        console.error('Error checking notification:', error);
      }
    };

    checkNotification();

    const handleNotificationUpdate = () => {
      checkNotification();
    };

    window.addEventListener('notificationUpdated', handleNotificationUpdate);

    return () => {
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
    };
  }, [location, activeNotificationId, processedNotifications]);

  // Reset processed notifications setiap 5 menit untuk menghindari memory leak
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessedNotifications(new Set());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initializeFCM = async () => {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        return;
      }

      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (error) {
        return;
      }

      if (Notification.permission === 'granted') {
        await getAndRegisterToken();
      }
    };

    const getAndRegisterToken = async () => {
      try {
        const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY;
        if (!vapidKey || vapidKey === 'YOUR_VAPID_KEY') {
          return;
        }

        const existingToken = localStorage.getItem('fcm_token');
        if (existingToken) {
          return;
        }

        const token = await getToken(messaging, { vapidKey });
        if (token) {
          localStorage.setItem('fcm_token', token);

          try {
            const response = await fetch(`${import.meta.env.VITE_NOTIF_SERVER || 'https://notifikasi-server.vercel.app'}/api/register-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
            });
          } catch (err) {
            console.error('Register token failed:', err);
          }
        }
      } catch (error) {
        console.error('FCM token error:', error);
      }
    };

    initializeFCM();

    const unsubscribe = onMessage(messaging, (payload: any) => {
      if (payload.notification) {
        // Cek apakah notifikasi FCM sudah diproses
        const notificationId = payload.messageId || Date.now().toString();
        if (processedNotifications.has(notificationId)) {
          return;
        }

        setProcessedNotifications(prev => new Set([...prev, notificationId]));
        
        toast(payload.notification.title || 'Notification', {
          description: payload.notification.body,
          className: "bg-gradient-to-r from-green-400 to-blue-500 text-white border-none",
          position: "bottom-left",
        });

        if (payload.data && payload.data.type === 'admin_notification') {
          window.dispatchEvent(new CustomEvent('notificationUpdated'));
        }
      }
    });

    return unsubscribe;
  }, [processedNotifications]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveNotificationId(null);
    }, 1000);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser ini tidak mendukung notifikasi');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      localStorage.setItem('notification_permission_requested', 'requested');

      if (permission === 'granted') {
        const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY;
        if (vapidKey && vapidKey !== 'YOUR_VAPID_KEY') {
          try {
            const token = await getToken(messaging, { vapidKey });
            if (token) {
              localStorage.setItem('fcm_token', token);

              const response = await fetch(`${import.meta.env.VITE_NOTIF_SERVER || 'https://notifikasi-server.vercel.app'}/api/register-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
              });
            }
          } catch (tokenError) {
            console.error('Error getting token:', tokenError);
          }
        }
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  useEffect(() => {
    const checkPermission = () => {
      if ('Notification' in window) {
        setPermissionStatus(Notification.permission);
      } else {
        setPermissionStatus('unsupported');
      }
      setPermissionChecked(true);
    };

    const timer = setTimeout(checkPermission, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {permissionChecked && permissionStatus !== 'granted' && permissionStatus !== 'checking' && permissionStatus !== 'unsupported' && !localStorage.getItem('notification_permission_requested') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V12a3 3 0 00-6 0v5H9a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Izinkan Notifikasi
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Dapatkan notifikasi terbaru tentang promo, update produk, dan informasi penting dari Printology.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem('notification_permission_requested', 'dismissed');
                    setPermissionStatus('denied');
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Nanti Saja
                </button>
                <button
                  onClick={async () => {
                    localStorage.setItem('notification_permission_requested', 'requested');
                    await requestNotificationPermission();
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Izinkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {permissionStatus !== 'granted' && localStorage.getItem('notification_permission_requested') === 'dismissed' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={requestNotificationPermission}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
          >
            Izinkan Notifikasi
          </button>
        </div>
      )}

      {isVisible && currentNotification && (
        <>
          <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base">
                        {currentNotification.message}
                      </p>
                      <p className="text-xs opacity-90 mt-1">
                        Notifikasi dari Printology Dev
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
                    aria-label="Tutup notifikasi"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-16 md:h-14"></div>
        </>
      )}
    </>
  );
};

export default NotificationBanner;
