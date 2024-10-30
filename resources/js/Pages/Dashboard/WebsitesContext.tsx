import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLaravelEcho } from '@/utils/LaravelEchoSocket';
import { usePage } from '@inertiajs/react';

const WebsitesContext = createContext(null);
const notificationSoundUrl = '/audio/notification-6.mp3'; 

export const WebsitesProvider = ({ children, initWebsites, initOpenedCount, initClosedCount }) => {
  const [websites, setWebsites] = useState(initWebsites);
  const [openedCount, setOpenedCount] = useState(initOpenedCount);
  const [closedCount, setClosedCount] = useState(initClosedCount);
  const { auth } = usePage().props;

  const styleTheCounter = (length) => {
    if(length <= 2) return 'text-green-300';
    if(length === 3) return 'text-orange-300';
    if(length === 4) return 'text-orange-300';
    if(length === 5) return 'text-red-700';
  }

  // Broadcast Client
  const laravelEcho = useLaravelEcho();
  useEffect(() => {
    const audio = new Audio(notificationSoundUrl);
    const channel = laravelEcho
      .join(`broadcast-sites-statuses.${auth.user.id}`)
      .listen('BroadcastSiteStatusToUser', (data) => {
        console.log('Website status updated: ', data);
        // Find and update the website by id
        setWebsites((prevWebsites) => 
          prevWebsites.map((website) => 
            website.id === data.id ? { 
              ...website, 
              is_online: data.is_online ,
              last_checked_at: data.last_checked_at
            } : website
          )
        );

        //Update Counts
        if(data.is_online === true) {
          setOpenedCount(openedCount + 1);
          setClosedCount(closedCount - 1);
        } else {
          setOpenedCount(openedCount - 1);
          setClosedCount(closedCount + 1);
        }
        
        // Play notification sound
        audio.play().catch((error) => {
          console.error('Failed to play audio:', error);
        });
      });

    return () => {
      channel.stopListening('BroadcastSiteStatusToUser');
      laravelEcho.leave(`broadcast-sites-statuses`);
    };
  }, []);


  const value = { 
    styleTheCounter,
    websites,
    openedCount, 
    closedCount
  }

  return (
    <WebsitesContext.Provider
      value={value}
    >
      {children}
    </WebsitesContext.Provider>
  );
};

export const useWebsites = () => useContext(WebsitesContext);