import React, { useEffect, useState } from 'react';

interface TimeDisplayProps {
  timeSpentMs: number;
  className?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeSpentMs, className = '' }) => {
  const [currentTime, setCurrentTime] = useState(timeSpentMs);

  useEffect(() => {
    setCurrentTime(timeSpentMs);
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeSpentMs]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`text-sm font-medium text-gray-700 ${className}`}>
      ⏱️ {formatTime(currentTime)}
    </div>
  );
};
