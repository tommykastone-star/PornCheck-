import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold text-white bg-[#0f1b38] shadow-2xl border border-[#1e3875] animate-in fade-in slide-in-from-bottom-2"
    >
      <WifiOff className="w-3.5 h-3.5 animate-pulse text-[#38bdf8]" />
      <span>Offline Mode — Cached adult media available</span>
    </div>
  );
};
