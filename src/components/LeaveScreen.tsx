import React from 'react';
import { Lock } from 'lucide-react';

interface LeaveScreenProps {
  onReturn: () => void;
}

export const LeaveScreen: React.FC<LeaveScreenProps> = ({ onReturn }) => {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-5 select-none"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
    >
      <div
        className="w-full max-w-[380px] text-center p-10 rounded-[14px] shadow-2xl border"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-[#15264f] border border-[#1e3875] text-[#38bdf8]">
          <Lock className="w-5 h-5 opacity-90" />
        </div>
        <h2 className="text-[22px] font-bold m-0 mb-2 text-white">See you later</h2>
        <p className="text-[14px] leading-relaxed m-0 mb-6" style={{ color: 'var(--mute)' }}>
          You must be an adult to enter PornCheck. Access has been restricted for your session.
        </p>
        <button
          onClick={onReturn}
          className="px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-all hover:bg-slate-100 shadow-md"
          style={{
            backgroundColor: '#ffffff',
            color: '#070d1e',
          }}
        >
          Return to Verification
        </button>
      </div>
    </main>
  );
};
