import React, { useState, useRef } from 'react';
import { MediaFile, CategoryName, UserAccount, CommentItem } from '../types';
import { CATEGORIES, formatVideoDuration } from '../data/categories';
import {
  X,
  Trash2,
  FolderInput,
  Download,
  Calendar,
  HardDrive,
  Star,
  Check,
  Share2,
  MessageSquare,
  DollarSign,
  Lock,
  Send,
  UserPlus,
  Gamepad2,
  Megaphone,
  ExternalLink,
  Film,
  Timer,
} from 'lucide-react';

interface MediaLightboxProps {
  file: MediaFile | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onMoveCategory: (id: string, newCategory: CategoryName) => void;
  onToggleFavorite: (id: string) => void;
  onAddComment: (fileId: string, commentText: string) => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  file,
  onClose,
  onDelete,
  onMoveCategory,
  onToggleFavorite,
  onAddComment,
  user,
  onOpenAuth,
}) => {
  const [isMoving, setIsMoving] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CategoryName | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showShareNotification, setShowShareNotification] = useState(false);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  if (!file) return null;

  const isVideo = file.type.startsWith('video');
  const isImage = file.type.startsWith('image');
  const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  const formattedDate = new Date(file.addedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDownload = () => {
    // "Sign up to interact more with the contents interms of downloading contents, sharing, saving, commenting etc."
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!file.url && !file.dataUrl) return;
    const a = document.createElement('a');
    a.href = file.url || file.dataUrl || '';
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (navigator.share) {
      navigator
        .share({
          title: `PornCheck: ${file.name}`,
          text: `Check out ${file.name} on PornCheck`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2500);
    }
  };

  const handleFavoriteClick = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    onToggleFavorite(file.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!newComment.trim()) return;
    onAddComment(file.id, newComment.trim());
    setNewComment('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={file.name}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-xl overflow-hidden shadow-2xl border"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--line)',
          color: 'var(--ink)',
        }}
      >
        {/* Top Header Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b text-sm"
          style={{ borderColor: 'var(--line)', backgroundColor: '#2e1e17' }}
        >
          <div className="flex items-center gap-2 truncate mr-3">
            <span className="font-bold truncate max-w-xs sm:max-w-md text-[#f7ede8]">
              {file.name}
            </span>
            <span
              className="text-[11px] px-2.5 py-0.5 rounded-full shrink-0 font-semibold border"
              style={{
                backgroundColor: 'var(--tile)',
                borderColor: 'var(--line)',
                color: '#e2a049',
              }}
            >
              {file.category}
            </span>

            {file.price !== undefined && file.price > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-[#e2a049] text-black">
                ${file.price.toFixed(2)}
              </span>
            )}

            {file.isPornAd && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#c86d3b] text-white">
                Porn Ad
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Favorite / Save */}
            <button
              onClick={handleFavoriteClick}
              className="p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-[#bfa59a]"
              title={
                user
                  ? file.isFavorite
                    ? 'Saved in Favorites'
                    : 'Save to Favorites'
                  : 'Sign up to Save'
              }
            >
              <Star
                className={`w-4 h-4 ${
                  file.isFavorite ? 'fill-[#e2a049] text-[#e2a049]' : 'opacity-70'
                }`}
              />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-[#bfa59a] relative"
              title={user ? 'Share link' : 'Sign up to Share'}
            >
              <Share2 className="w-4 h-4 opacity-80" />
              {showShareNotification && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-[#c86d3b] text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-[#bfa59a]"
              title={user ? 'Download media' : 'Sign up to Download'}
            >
              <Download className="w-4 h-4 opacity-80" />
            </button>

            {/* Move category (logged in) */}
            {user && (
              <button
                onClick={() => setIsMoving(!isMoving)}
                className={`p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-[#bfa59a] ${
                  isMoving ? 'bg-white/10' : ''
                }`}
                title="Move to another category"
              >
                <FolderInput className="w-4 h-4 opacity-80" />
              </button>
            )}

            {/* Delete button (logged in) */}
            {user && (
              <button
                onClick={() => {
                  onDelete(file.id);
                  onClose();
                }}
                className="p-1.5 rounded-full hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                title="Delete file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/5 transition-colors ml-1 cursor-pointer text-[#f7ede8]"
              title="Close viewer (Esc)"
            >
              <X className="w-5 h-5 opacity-90" />
            </button>
          </div>
        </div>

        {/* Category Move Bar */}
        {isMoving && user && (
          <div
            className="p-3 border-b flex flex-wrap items-center gap-2 text-xs"
            style={{ backgroundColor: 'var(--tile)', borderColor: 'var(--line)' }}
          >
            <span className="font-semibold text-xs text-[#94a3b8]">Move to:</span>
            <select
              value={selectedCat || file.category}
              onChange={(e) => setSelectedCat(e.target.value as CategoryName)}
              className="text-xs p-1.5 rounded border bg-[#070d1e] text-white font-medium border-[#1e3875]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (selectedCat && selectedCat !== file.category) {
                  onMoveCategory(file.id, selectedCat);
                }
                setIsMoving(false);
              }}
              className="px-3 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow hover:bg-slate-100"
              style={{
                backgroundColor: 'var(--btn)',
                color: 'var(--btnink)',
              }}
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        )}

        {/* Media & Interactive Details Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black">
          {/* Main Media Preview */}
          <div className="flex-1 min-h-[280px] max-h-[60vh] md:max-h-[70vh] flex items-center justify-center overflow-hidden relative bg-[#070d1e]">
            {isImage && (
              <img
                src={file.url || file.dataUrl}
                alt={file.name}
                className="max-h-full max-w-full object-contain select-none"
              />
            )}

            {isVideo && (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={mainVideoRef}
                  src={file.url || file.dataUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-full max-w-full object-contain scale-x-100"
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>
            )}

            {!isImage && !isVideo && (
              <div className="text-white/80 text-center p-8">
                <Gamepad2 className="w-12 h-12 mx-auto mb-2 text-[#38bdf8]" />
                <p className="text-base font-bold mb-1">{file.name}</p>
                <p className="text-xs text-[#94a3b8] mb-4">
                  {file.category === 'Porn Games'
                    ? 'Interactive Adult Game Package'
                    : 'Media File'}
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-full font-bold text-xs bg-white text-[#070d1e] hover:bg-slate-100 shadow-md cursor-pointer"
                >
                  Download Game File
                </button>
              </div>
            )}
          </div>

          {/* Interactive Comments & Metadata Sidebar */}
          <div
            className="w-full md:w-80 flex flex-col border-t md:border-t-0 md:border-l"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--line)',
            }}
          >
            {/* Header info */}
            <div className="p-3.5 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  {formattedSize}
                </span>
                {file.duration && (
                  <span className="flex items-center gap-1 font-bold text-[#38bdf8]">
                    <Timer className="w-3.5 h-3.5" />
                    {formatVideoDuration(file.duration)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
              </div>

              {/* Price display if set */}
              {file.price !== undefined && file.price > 0 && (
                <div className="mt-2.5 p-2 rounded-lg bg-[#15264f] border border-[#1e3875] flex items-center justify-between">
                  <span className="text-xs text-[#94a3b8]">Movie Price:</span>
                  <span className="text-sm font-extrabold text-[#38bdf8]">
                    ${file.price.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Sponsor & Ad Information if Porn Ad */}
              {file.isPornAd && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-[#15264f] border border-[#1e3875]">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#38bdf8] mb-1">
                    <span className="flex items-center gap-1">
                      <Megaphone className="w-3.5 h-3.5" /> SPONSORED AD
                    </span>
                    <span className="text-[10px] text-white">
                      {file.uploaderName || 'Adult Ads Network'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] m-0 mb-2 leading-tight">
                    Official adult commercial video broadcast.
                  </p>
                  <a
                    href="https://example.com/sponsor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-full text-xs font-bold bg-white text-[#070d1e] hover:bg-slate-100 shadow-md"
                  >
                    <span>Visit Sponsor Offer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 min-h-[140px] max-h-[30vh] md:max-h-none">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f7ede8] mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#e2a049]" />
                <span>Comments ({file.comments?.length || 0})</span>
              </div>

              {file.comments && file.comments.length > 0 ? (
                file.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-2.5 rounded-lg text-xs border"
                    style={{
                      backgroundColor: 'var(--tile)',
                      borderColor: 'var(--line)',
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#e2a049]">{comm.userName}</span>
                      <span className="text-[#bfa59a] text-[10px]">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="m-0 text-[#f7ede8] leading-relaxed break-words">
                      {comm.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-[#bfa59a]">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>

            {/* Comment Input / Sign Up Gate */}
            <div
              className="p-3 border-t"
              style={{
                borderColor: 'var(--line)',
                backgroundColor: 'var(--card)',
              }}
            >
              {user ? (
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#070d1e] border border-[#1e3875] text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-white text-[#070d1e] hover:bg-slate-100 shadow cursor-pointer transition-colors"
                    title="Send comment"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="text-[11px] text-[#94a3b8] m-0 mb-2">
                    Sign up to comment, download, save favorites & interact.
                  </p>
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-1.5 px-3 rounded-full text-xs font-bold text-[#070d1e] bg-white hover:bg-slate-100 shadow cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up to Interact</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
