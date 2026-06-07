import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { networkService } from '../services/networkService';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsubscribe = networkService.addNetworkStatusListener((online) => {
      setIsOnline(online);
    });

    return unsubscribe;
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 right-6 z-50 ${className}`}>
      <div className="bg-red-500 text-white px-2 py-1 rounded-lg shadow-lg flex items-center space-x-2">
        <span className="text-sm font-medium">{t('offlineMode')}</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
