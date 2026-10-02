import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface AgeGateProps {
  onConfirm: () => void;
  onReject: () => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onConfirm, onReject }) => {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-5 select-none"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
    >
      <div
        className="w-full max-w-[390px] text-center p-10 md:p-12 rounded-[14px] shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--line)',
        }}
      >
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-[#15264f] border border-[#1e3875] text-[#38bdf8]">
          <ShieldAlert className="w-6 h-6 opacity-90" />
        </div>

        <h2 className="text-[24px] font-bold tracking-tight m-0 mb-2.5 text-white">
          Adults only (18+)
        </h2>

        <p
          className="text-[14px] leading-relaxed m-0 mb-6"
          style={{ color: 'var(--mute)' }}
        >
          This website contains adult material. Enter only if you are at least 18
          years old, or the legal age in your location. Watching & searching is free with no sign up needed.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            id="yes"
            onClick={onConfirm}
            className="w-full py-3 px-5 rounded-full font-bold text-sm transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 hover:bg-slate-100 shadow-md"
            style={{
              backgroundColor: 'var(--btn)',
              color: 'var(--btnink)',
            }}
          >
            <span>I am 18 or older — Enter for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="no"
            onClick={onReject}
            className="w-full py-2.5 px-5 rounded-full font-semibold text-xs transition-colors hover:bg-slate-100 cursor-pointer shadow-sm border border-slate-200"
            style={{
              backgroundColor: '#ffffff',
              color: '#070d1e',
            }}
          >
            Leave
          </button>
        </div>

        <p className="mt-5 text-[11px] opacity-60 m-0" style={{ color: 'var(--mute)' }}>
          By entering, you confirm you are of legal age in your jurisdiction.
        </p>
      </div>
    </main>
  );
};
