import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLaravelEcho } from '@/utils/LaravelEchoSocket';

const AdminNotificationContext = createContext(null);
const notificationSoundUrl = '/assets/audio/notification-6.mp3'; 

export const AdminNotificationProvider = ({ children }) => {
  const laravelEcho = useLaravelEcho();

  useEffect(() => {
    const audio = new Audio(notificationSoundUrl);
    const channel = laravelEcho
      .channel(`user-notification`)
      .listen('NotifyAdminEvent', (newNotificationOrder) => {
        console.log('newNotificationOrder: ', newNotificationOrder);
        // Play notification sound
        audio.play().catch((error) => {
          console.error('Failed to play audio:', error);
        });
      });

    return () => {
      channel.stopListening('NotifyAdminEvent');
      laravelEcho.leave(`admin-notification`);
    };
  }, []);

  return (
    <AdminNotificationContext.Provider
      value={{ }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotification = () => useContext(AdminNotificationContext);