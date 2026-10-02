import React, { useEffect, useState } from 'react';
import { ArrowRight, Flame } from 'lucide-react';

interface WelcomeScreenProps {
  onProceed: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onProceed }) => {
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    // 3 seconds countdown as requested: "Welcome Screen loads for 3 seconds to move to the Home Screen"
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timer = setTimeout(() => {
      onProceed();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onProceed]);

  return (
    <main
      className="min-h-screen flex items-center justify-center p-5 select-none transition-opacity duration-500"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--ink)',
      }}
    >
      <div
        className="w-full max-w-[390px] text-center p-10 sm:p-12 rounded-[14px] shadow-2xl transition-all duration-300 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--line)',
        }}
      >
        {/* Decorative subtle ambient navy/cyan glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#38bdf8]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#0ea5e9]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-[#15264f] border border-[#1e3875] text-[#38bdf8]">
          <Flame className="w-6 h-6 fill-current opacity-90" />
        </div>

        <small
          className="block text-[15px] sm:text-[17px] tracking-[0.06em] uppercase font-semibold leading-tight mb-2"
          style={{ color: 'var(--mute)' }}
        >
          WELCOME<br />TO
        </small>
        <h1 className="text-[44px] sm:text-[46px] font-bold tracking-[-0.03em] m-0 leading-none text-white">
          PornCheck
        </h1>

        <p className="mt-3 text-xs opacity-75 leading-relaxed" style={{ color: 'var(--mute)' }}>
          Explore, stream & watch free adult content or sign up to interact & upload.
        </p>

        {/* Enter for free button with white background */}
        <div className="mt-7 flex flex-col items-center gap-3">
          <button
            onClick={onProceed}
            className="w-full py-3 px-6 rounded-full font-bold text-sm transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2 hover:bg-slate-100"
            style={{
              backgroundColor: 'var(--btn)',
              color: 'var(--btnink)',
            }}
          >
            <span>Enter for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <span
            className="text-[11px] tracking-wide font-mono opacity-80"
            style={{ color: 'var(--mute)' }}
          >
            Auto-entering in {secondsLeft}s...
          </span>
        </div>
      </div>
    </main>
  );
};
