import React, { useRef } from 'react';
import { UserAccount, MediaFile } from '../types';
import { X, ShieldCheck, HardDrive, LogOut, Trash2, Lock, DollarSign, Camera, Upload } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  files: MediaFile[];
  onSignOut: () => void;
  onClearAllData: () => void;
  onLockSession: () => void;
  onUpdateUser?: (updated: UserAccount) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  files,
  onSignOut,
  onClearAllData,
  onLockSession,
  onUpdateUser,
}) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated: UserAccount = {
        ...user,
        avatar: dataUrl,
      };
      localStorage.setItem('pc_user', JSON.stringify(updated));
      onUpdateUser?.(updated);
    };
    reader.readAsDataURL(file);
  };

  const userFiles = user
    ? files.filter((f) => !f.uploaderEmail || f.uploaderEmail === user.email)
    : files;

  const totalBytes = userFiles.reduce((acc, f) => acc + (f.size || 0), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
  const imageCount = userFiles.filter((f) => f.type.startsWith('image/')).length;
  const videoCount = userFiles.filter((f) => f.type.startsWith('video/')).length;
  const pricedMovies = userFiles.filter((f) => f.price !== undefined && f.price > 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Profile and Vault Settings"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-[390px] rounded-xl p-6 shadow-2xl relative border"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--line)',
          color: 'var(--ink)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-[#bfa59a]"
          title="Close"
        >
          <X className="w-4 h-4 opacity-80" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="relative group">
            <div
              className="w-13 h-13 rounded-full flex items-center justify-center font-bold text-lg border overflow-hidden bg-[#15264f] border-[#1e3875] text-[#38bdf8]"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || user.email}
                  className="w-full h-full object-cover"
                />
              ) : user ? (
                (user.name || user.email)[0].toUpperCase()
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>

            {user && (
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Upload Creator Face Photo"
              >
                <Camera className="w-4 h-4 text-[#38bdf8]" />
              </button>
            )}

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold m-0 leading-tight text-white">
                {user ? user.name || 'PornCheck Creator' : 'Free Visitor'}
              </h2>
              {user?.avatar && (
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-green-950 text-green-400 font-bold border border-green-800">
                  Face Verified
                </span>
              )}
            </div>
            <p className="text-xs m-0 truncate max-w-[200px] text-[#94a3b8]">
              {user ? user.email : 'Watching & Searching (Free Mode)'}
            </p>
            {user && (
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="mt-1 text-[11px] text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Upload className="w-3 h-3" />
                <span>{user.avatar ? 'Change Face Photo' : 'Upload Face Photo'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Vault & Creator Stats */}
        <div
          className="rounded-lg p-3.5 mb-4 border space-y-2 text-xs bg-[#15264f] border-[#1e3875]"
        >
          <div className="flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-[#94a3b8]">
              <HardDrive className="w-3.5 h-3.5" /> Storage Stored
            </span>
            <span className="font-bold text-white">{totalMB} MB</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
            <span>Total Uploaded Items</span>
            <span className="font-mono text-white">{userFiles.length} items</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
            <span>Content Breakdown</span>
            <span className="text-slate-300">{imageCount} photos · {videoCount} videos</span>
          </div>

          {pricedMovies.length > 0 && (
            <div className="flex items-center justify-between text-[11px] text-[#38bdf8] pt-1 border-t border-[#1e3875]">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Priced Movies Active
              </span>
              <span className="font-bold">{pricedMovies.length} movies</span>
            </div>
          )}
        </div>

        {/* Security & Vault Actions */}
        <div className="space-y-2 pt-1 text-xs">
          <button
            onClick={() => {
              onClose();
              onLockSession();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-[#1e3875] bg-[#070d1e]/60 hover:bg-[#15264f] transition-colors text-left cursor-pointer"
          >
            <Lock className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-white">Lock Session</div>
              <div className="text-[11px] text-[#94a3b8]">Require 18+ re-verification</div>
            </div>
          </button>

          <button
            onClick={() => {
              onClearAllData();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-red-800/40 text-red-300 bg-red-950/20 hover:bg-red-950/50 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="w-4 h-4 shrink-0 text-red-400" />
            <div className="flex-1">
              <div className="font-bold">Erase All Stored Media</div>
              <div className="text-[11px] text-red-400/80">Clears uploaded adult media from browser</div>
            </div>
          </button>

          {user && (
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left text-xs text-[#94a3b8] hover:text-white cursor-pointer pt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out of account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
