import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLaravelEcho } from '@/utils/LaravelEchoSocket';
import { usePage } from '@inertiajs/react';

const WebsitesContext = createContext(null);
const notificationSoundUrl = '/audio/notification-6.mp3'; 

export const WebsitesProvider = ({ children, initWebsites, initOpenedCount, initClosedCount, initConfirmedCount, initUnconfirmedCount, initPagination }) => {
  const [websites, setWebsites] = useState(initWebsites);
  const [openedCount, setOpenedCount] = useState(initOpenedCount);
  const [closedCount, setClosedCount] = useState(initClosedCount);
  const [confirmedCount, setConfirmedCount] = useState(initConfirmedCount);
  const [unconfirmedCount, setUnconfirmedCount] = useState(initUnconfirmedCount);
  const [pagination, setPagination] = useState(initPagination);
  
  const { auth } = usePage().props;

  const styleTheCounter = (length) => {
    if(length <= 2) return 'text-green-300';
    if(length === 3) return 'text-orange-300';
    if(length === 4) return 'text-orange-300';
    if(length === 5) return 'text-red-700';
  }

  const value = { 
    styleTheCounter,
    websites,
    openedCount, 
    closedCount,
    confirmedCount,
    unconfirmedCount,
    pagination
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