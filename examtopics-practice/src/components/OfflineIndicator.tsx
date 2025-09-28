import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { dataService } from '../services/dataService';
import { networkService } from '../services/networkService';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueueLength, setSyncQueueLength] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Listen for network status changes
    const unsubscribe = networkService.addNetworkStatusListener((online) => {
      setIsOnline(online);
    });

    // Check sync queue length periodically
    const interval = setInterval(() => {
      setSyncQueueLength(dataService.getSyncQueueLength());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleForceSync = async () => {
    if (isOnline && syncQueueLength > 0) {
      setIsSyncing(true);
      try {
        await dataService.forceSync();
        setSyncQueueLength(0);
      } catch (error) {
        console.error('Force sync failed:', error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  if (isOnline && syncQueueLength === 0) {
    return null; // Don't show anything when online and no pending sync
  }

  return (
    <div className={`fixed bottom-0 right-6 z-50 ${className}`}>
      {!isOnline ? (
        <div className="bg-red-500 text-white px-2 py-1 rounded-lg shadow-lg flex items-center space-x-2">
          <span className="text-sm font-medium">{t('offlineMode')}</span>
        </div>
      ) : syncQueueLength > 0 ? (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">
            {t('pendingSync', { count: syncQueueLength })}
          </span>
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 disabled:opacity-50"
          >
            {isSyncing ? t('syncing') : t('syncNow')}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default OfflineIndicator;
