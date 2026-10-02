import React, { useState } from 'react';
import { UserAccount } from '../types';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const account: UserAccount = {
      email: email.trim(),
      name: name.trim() || email.split('@')[0],
      createdAt: Date.now(),
    };

    localStorage.setItem('pc_user', JSON.stringify(account));
    onSuccess(account);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Account Authentication"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-[370px] rounded-xl p-6 sm:p-7 shadow-2xl relative border"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--line)',
          color: 'var(--ink)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-[#bfa59a]"
          title="Close dialog"
        >
          <X className="w-4 h-4 opacity-80" />
        </button>

        <div className="mb-4">
          <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center bg-[#15264f] border border-[#1e3875] text-[#38bdf8]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight m-0 text-white">
            {isSignUp ? 'Create PornCheck Account' : 'Sign In'}
          </h2>
          <p className="text-xs mt-1 m-0 text-[#94a3b8]">
            {isSignUp
              ? 'Unlock uploading, movie pricing, downloading, commenting & favorites.'
              : 'Sign in to manage your uploads, movie pricing and private vault.'}
          </p>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-lg text-xs bg-red-950/70 text-red-200 border border-red-800 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold mb-1 text-white">
                Display Name (Optional)
              </label>
              <div
                className="flex items-center rounded-lg px-3 py-2 border transition-colors bg-[#070d1e] border-[#1e3875]"
              >
                <User className="w-4 h-4 opacity-40 mr-2 shrink-0 text-[#94a3b8]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full bg-transparent border-0 outline-none text-sm text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 text-white">
              Email Address
            </label>
            <div
              className="flex items-center rounded-lg px-3 py-2 border transition-colors bg-[#070d1e] border-[#1e3875]"
            >
              <Mail className="w-4 h-4 opacity-40 mr-2 shrink-0 text-[#94a3b8]" />
              <input
                id="em"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent border-0 outline-none text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-white">
              Password
            </label>
            <div
              className="flex items-center rounded-lg px-3 py-2 border transition-colors bg-[#070d1e] border-[#1e3875]"
            >
              <Lock className="w-4 h-4 opacity-40 mr-2 shrink-0 text-[#94a3b8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent border-0 outline-none text-sm text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="close"
              type="submit"
              className="w-full py-2.5 px-4 rounded-full font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-md hover:bg-slate-100"
              style={{
                backgroundColor: 'var(--btn)',
                color: 'var(--btnink)',
              }}
            >
              {isSignUp ? 'Create Free Account' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t text-center text-xs border-[#1e3875]">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="hover:underline font-semibold cursor-pointer text-[#38bdf8]"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up free"}
          </button>
        </div>
      </div>
    </div>
  );
};
