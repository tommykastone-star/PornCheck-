import React, { useRef, useEffect } from 'react';
import { Search, X, User as UserIcon, UserPlus, Sparkles, Compass } from 'lucide-react';
import { UserAccount, BrowseMode } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  user: UserAccount | null;
  onLogoClick?: () => void;
  browseMode: BrowseMode;
  onToggleMode: (mode: BrowseMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAuth,
  onOpenProfile,
  user,
  onLogoClick,
  browseMode,
  onToggleMode,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3.5 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors shadow-md border-b"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--line)',
      }}
    >
      {/* Brand Logo */}
      <button
        onClick={onLogoClick}
        className="text-[20px] sm:text-[23px] font-bold tracking-tight cursor-pointer hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1"
        style={{ color: 'var(--ink)' }}
        title="PornCheck Home"
      >
        <span className="text-[#38bdf8]">Porn</span>
        <span className="text-white">Check</span>
      </button>

      {/* Mode Badge indicator in header */}
      <div className="hidden lg:flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#1e3875] bg-[#0c1733] text-[#94a3b8]">
        {browseMode === 'ai' ? (
          <span className="flex items-center gap-1 text-[#38bdf8]">
            <Sparkles className="w-3 h-3" /> AI Mode
          </span>
        ) : (
          <span className="flex items-center gap-1 text-white">
            <Compass className="w-3 h-3" /> Manual Mode
          </span>
        )}
      </div>

      {/* Search Input */}
      <div
        className="flex-1 max-w-xl mx-1 sm:mx-2 flex items-center rounded-full px-3 py-1.5 transition-colors border"
        style={{
          backgroundColor: 'var(--tile)',
          borderColor: 'var(--line)',
        }}
      >
        <Search className="w-4 h-4 opacity-50 shrink-0 mr-2 text-[#bfa59a]" />
        <input
          ref={searchInputRef}
          id="q"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${browseMode === 'ai' ? 'AI' : 'Manual'} adult contents & categories...`}
          aria-label="Search categories"
          className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm placeholder:opacity-50 min-w-0"
          style={{ color: 'var(--ink)' }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity text-[#bfa59a]"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: PWA Install Button, Sign Up icon / Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* In-App PWA Install Button */}
        <PWAInstallButton />

        {user ? (
          <button
            onClick={onOpenProfile}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border truncate max-w-[120px] sm:max-w-[150px] cursor-pointer flex items-center gap-1.5 hover:brightness-110"
            style={{
              borderColor: 'var(--line-strong)',
              color: 'var(--ink)',
              backgroundColor: 'var(--tile)',
            }}
            title={user.email}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
            <span className="truncate">{user.name || user.email.split('@')[0]}</span>
          </button>
        ) : (
          /* "Sign Up" icon appears if user didn’t sign in */
          <button
            id="signup"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold rounded-full px-3 py-1.5 sm:px-4 sm:py-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-md hover:bg-slate-100"
            style={{
              backgroundColor: 'var(--btn)',
              color: 'var(--btnink)',
            }}
            title="Sign Up to upload, set prices, comment, like & share"
          >
            <UserPlus className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Sign-Up</span>
          </button>
        )}

        {/* Profile Avatar / Quick Menu Button */}
        <button
          onClick={user ? onOpenProfile : onOpenAuth}
          className="w-[34px] h-[34px] rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 overflow-hidden border border-[#1e3875]"
          style={{
            backgroundColor: 'var(--tile)',
          }}
          aria-label="Profile and Settings"
          title={user ? 'Manage Vault & Profile' : 'Sign In / Register'}
        >
          {user ? (
            user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || user.email}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold uppercase text-[#e2a049]">
                {(user.name || user.email)[0]}
              </span>
            )
          ) : (
            <UserIcon className="w-4 h-4 opacity-70 text-[#bfa59a]" />
          )}
        </button>
      </div>
    </header>
  );
};
