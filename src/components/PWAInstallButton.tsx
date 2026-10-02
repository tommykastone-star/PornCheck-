import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    await install();
    setIsInstalling(false);
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:bg-slate-100"
        style={{
          backgroundColor: '#ffffff',
          color: '#070d1e',
        }}
        title="Install PornCheck App to your home screen or desktop"
        aria-label="Install App"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">Install App</span>
        <span className="xs:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md hover:bg-slate-100 cursor-pointer"
          style={{
            backgroundColor: '#ffffff',
            color: '#070d1e',
          }}
          title="How to install PornCheck on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Install App</span>
          <span className="xs:hidden">Install</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in"
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl border text-left relative"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--line)',
                color: 'var(--ink)',
              }}
            >
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-[#bfa59a] hover:text-white"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-[#3b281f] border border-[#4e3427] text-[#e2a049]">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-[#f7ede8] m-0 mb-1">
                Install PornCheck on iPhone
              </h3>
              <p className="text-xs text-[#bfa59a] m-0 mb-5 leading-relaxed">
                Add PornCheck directly to your home screen for instant standalone full-screen access.
              </p>

              <div className="space-y-3.5 text-xs text-[#f7ede8] bg-[#211510] p-4 rounded-xl border border-[#4e3427] mb-5">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c86d3b] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    Tap the <strong className="text-[#e2a049]">Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-[#e2a049]" /> in the Safari toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c86d3b] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    Scroll down and tap <strong className="text-[#e2a049]">"Add to Home Screen"</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c86d3b] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    Tap <strong className="text-[#e2a049]">Add</strong> in the top right to complete.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-full font-bold text-xs bg-[#c86d3b] text-white hover:brightness-110 cursor-pointer shadow"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
