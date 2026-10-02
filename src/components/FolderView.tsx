import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { CategoryName, MediaFile, UserAccount } from '../types';
import { CATEGORIES, validateFileForCategory, formatVideoDuration } from '../data/categories';
import {
  ArrowLeft,
  Upload,
  Play,
  Trash2,
  Film,
  Image as ImageIcon,
  DollarSign,
  Plus,
  Gamepad2,
  Megaphone,
  Lock,
  MessageSquare,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  ExternalLink,
  RefreshCw,
  Flame,
  Eye,
  Timer,
  Zap,
} from 'lucide-react';

interface FolderViewProps {
  category: CategoryName;
  files: MediaFile[];
  onBack: () => void;
  onAddFiles: (
    files: FileList | File[],
    targetCategory: CategoryName,
    options?: {
      price?: number;
      isPornAd?: boolean;
      gamePlatform?: string;
    }
  ) => void;
  onFetchPornAds?: () => Promise<void> | void;
  isFetchingAds?: boolean;
  onDeleteFile: (id: string) => void;
  onSelectFile: (file: MediaFile) => void;
  isAiMode: boolean;
  user: UserAccount | null;
  onOpenAuth: () => void;
  onClearCategory?: (category: CategoryName) => void;
}

export const FolderView: React.FC<FolderViewProps> = ({
  category,
  files,
  onBack,
  onAddFiles,
  onFetchPornAds,
  isFetchingAds = false,
  onDeleteFile,
  onSelectFile,
  isAiMode,
  user,
  onOpenAuth,
  onClearCategory,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'price' | 'name'>('newest');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Upload modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState<string>('0');
  const [isPornAdChecked, setIsPornAdChecked] = useState<boolean>(category === 'Porn Videos');
  const [gamePlatform, setGamePlatform] = useState<string>('PC / Web Browser');
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const floatingFileInputRef = useRef<HTMLInputElement>(null);

  const categoryMeta = CATEGORIES.find((c) => c.name === category);

  // Filter files belonging to this category
  const categoryFiles = files.filter(
    (f) => category === 'All' || f.category === category
  );

  // Filter by media type
  const filteredFiles = categoryFiles.filter((f) => {
    if (filterType === 'images') return f.type.startsWith('image/');
    if (filterType === 'videos') return f.type.startsWith('video/');
    return true;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortOrder === 'newest') return b.addedAt - a.addedAt;
    if (sortOrder === 'oldest') return a.addedAt - b.addedAt;
    if (sortOrder === 'price') return (b.price || 0) - (a.price || 0);
    if (sortOrder === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  // Handle incoming file selection (validates file name/content matching category rule)
  const processIncomingFiles = (incomingList: FileList | File[]) => {
    setValidationError(null);
    const arr = Array.from(incomingList);
    if (arr.length === 0) return;

    // Check category rules
    for (const f of arr) {
      const validation = validateFileForCategory(f, category, {
        isPornAd: category === 'Porn Videos' ? true : false,
      });
      if (!validation.valid) {
        setValidationError(validation.reason || `Invalid content for "${category}".`);
        return;
      }
    }

    // If category is "Porn Movies" or user wants to set price / configure ad / game
    if (category === 'Porn Movies' || category === 'Porn Games' || category === 'Porn Videos') {
      setStagedFiles(arr);
      setIsUploadModalOpen(true);
    } else {
      // Direct upload
      onAddFiles(arr, category, {
        isPornAd: false,
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      if (!user) {
        onOpenAuth();
        return;
      }
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Submit staged upload modal
  const handleConfirmModalUpload = () => {
    const priceNum = parseFloat(customPrice);
    onAddFiles(stagedFiles, category, {
      price: !isNaN(priceNum) && priceNum > 0 ? priceNum : undefined,
      isPornAd: category === 'Porn Videos' ? true : isPornAdChecked,
      gamePlatform: category === 'Porn Games' ? gamePlatform : undefined,
    });
    setStagedFiles([]);
    setIsUploadModalOpen(false);
    setCustomPrice('0');
  };

  return (
    <div
      className="min-h-screen flex flex-col pb-24 relative"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Folder Header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 sm:px-6 transition-colors border-b shadow-sm"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            id="back"
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-lg font-bold text-[#f7ede8]"
            title="Back to categories"
            aria-label="Back to categories"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1
                id="folderTitle"
                className="text-[18px] sm:text-[21px] font-bold tracking-tight m-0 leading-tight text-white"
              >
                {category}
              </h1>

              {category === 'Porn Videos' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#15264f] text-[#38bdf8] border border-[#1e3875] flex items-center gap-1">
                  <Megaphone className="w-3 h-3" /> Porn Ads Videos
                </span>
              )}

              {category === 'Porn Games' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#15264f] text-[#38bdf8] border border-[#1e3875] flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3" /> Interactive Games
                </span>
              )}

              {category === 'Porn Movies' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#15264f] text-[#38bdf8] border border-[#1e3875] flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Cinema & Pricing
                </span>
              )}

              {category === 'Porn Shorts' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#15264f] text-[#38bdf8] border border-[#1e3875] flex items-center gap-1">
                  <Timer className="w-3 h-3 text-[#38bdf8]" /> Videos &lt; 3 mins
                </span>
              )}
            </div>

            <p className="text-xs m-0 mt-0.5 text-[#94a3b8]">
              {categoryFiles.length} {categoryFiles.length === 1 ? 'item' : 'items'} in {isAiMode ? 'AI Mode' : 'Manual Mode'}
            </p>
          </div>
        </div>

        {/* Filter & Sort Controls + Action Buttons */}
        <div className="flex items-center gap-2">
          {category === 'Porn Videos' && onFetchPornAds && (
            <button
              onClick={() => onFetchPornAds()}
              disabled={isFetchingAds}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer bg-white text-[#070d1e] hover:bg-slate-100 disabled:opacity-60"
              title="Fetch latest available pornography ads from sponsors network"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingAds ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Fetch Available Ads</span>
              <span className="sm:hidden">Fetch Ads</span>
            </button>
          )}

          <div
            className="hidden sm:flex items-center p-0.5 rounded-lg border text-xs"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--tile)' }}
          >
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-[#070d1e] shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              All
            </button>
            {category !== 'Porn Shorts' && (
              <button
                onClick={() => setFilterType('images')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  filterType === 'images'
                    ? 'bg-white text-[#070d1e] shadow-xs'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Images
              </button>
            )}
            <button
              onClick={() => setFilterType('videos')}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                filterType === 'videos'
                  ? 'bg-white text-[#070d1e] shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Videos
            </button>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs p-1.5 rounded-lg border bg-[#15264f] text-white font-medium border-[#1e3875] cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            {category === 'Porn Movies' && <option value="price">Highest Price</option>}
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-[1000px] w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col">
        {/* Category Description Banner */}
        <div
          className="mb-5 p-3.5 sm:p-4 rounded-xl border flex items-start justify-between gap-3 text-xs sm:text-sm"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--line)',
            color: 'var(--mute)',
          }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
            <div className="flex-1">
              <b className="text-white">{category}:</b> {categoryMeta?.description}
              <div className="mt-1 text-[11px] text-[#38bdf8] font-medium flex items-center gap-1">
                <span>Accepted Content:</span>
                <span className="text-white">{categoryMeta?.acceptDescription}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button for Porn Videos */}
          {category === 'Porn Videos' && onFetchPornAds && (
            <button
              onClick={() => onFetchPornAds()}
              disabled={isFetchingAds}
              className="shrink-0 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#070d1e] shadow-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Fetch Adult Ads Network</span>
            </button>
          )}
        </div>

        {/* Validation Error Alert if user tried invalid file */}
        {validationError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs sm:text-sm flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button
              onClick={() => setValidationError(null)}
              className="text-xs underline text-red-300 hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Upload Zone */}
        {user ? (
          <label
            id="drop"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group flex flex-col items-center justify-center p-7 sm:p-9 rounded-xl text-center cursor-pointer transition-all border-2 border-dashed ${
              isDragOver
                ? 'scale-[1.01] bg-[#15264f] border-[#38bdf8]'
                : 'bg-[#0f1b38]/60 hover:border-[#38bdf8] hover:bg-[#0f1b38]'
            }`}
            style={{
              borderColor: isDragOver ? '#38bdf8' : 'var(--line)',
              color: 'var(--mute)',
            }}
          >
            <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-[#15264f] border border-[#1e3875] text-[#38bdf8] group-hover:scale-110 transition-transform">
              {category === 'Porn Shorts' ? (
                <Zap className="w-6 h-6 text-[#38bdf8] fill-current" />
              ) : category === 'Porn Videos' ? (
                <Megaphone className="w-6 h-6" />
              ) : category === 'Porn Games' ? (
                <Gamepad2 className="w-6 h-6" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div className="text-sm sm:text-base font-bold text-white">
              {category === 'Porn Shorts' ? (
                <><b>Click to upload short videos</b> or drag video clips here (&lt; 3 mins)</>
              ) : (
                <><b>Click to upload</b> or drag {category} files here</>
              )}
            </div>

            <p className="text-xs sm:text-sm mt-1 mb-0 opacity-80 text-[#94a3b8]">
              {category === 'Porn Shorts'
                ? 'Upload short adult video clips strictly below 3 minutes (.mp4, .webm, .mov, max 180 seconds).'
                : category === 'Porn Videos'
                ? 'Upload porn ads videos (.mp4, .webm, promo clips).'
                : category === 'Porn Games'
                ? 'Upload your interactive porn games (.zip, .apk, .html, packages).'
                : category === 'Porn Movies'
                ? 'Upload full adult movies and set your price per movie.'
                : `Only contents strictly matching "${category}" are accepted.`}
            </p>

            <input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              multiple
              accept={
                category === 'Porn Shorts'
                  ? 'video/*'
                  : category === 'Porn Images'
                  ? 'image/*'
                  : category === 'Porn Movies' || category === 'Porn Videos'
                  ? 'video/*'
                  : category === 'Porn Games'
                  ? '*/*'
                  : 'image/*,video/*'
              }
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>
        ) : (
          /* Sign-in prompt for non-logged in visitors */
          <div
            className="p-6 rounded-xl border border-dashed text-center flex flex-col items-center justify-center bg-[#0f1b38]/50"
            style={{ borderColor: 'var(--line)' }}
          >
            <div className="w-11 h-11 rounded-full mb-2.5 flex items-center justify-center bg-[#15264f] border border-[#1e3875] text-[#38bdf8]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white m-0 mb-1">
              Sign In to Upload Content
            </h3>
            <p className="text-xs text-[#94a3b8] max-w-md m-0 mb-4">
              Watching & searching on PornCheck is 100% free with no sign-up needed. Sign in or create an account to upload, set movie prices, download, comment, and save items.
            </p>
            <button
              onClick={onOpenAuth}
              className="py-2.5 px-6 rounded-full font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-md hover:bg-slate-100"
              style={{
                backgroundColor: 'var(--btn)',
                color: 'var(--btnink)',
              }}
            >
              Sign Up or Sign In to Upload
            </button>
          </div>
        )}

        {/* Media Grid */}
        {sortedFiles.length > 0 ? (
          <div
            id="files"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5 mt-6"
          >
            {sortedFiles.map((file) => {
              const isVideo = file.type.startsWith('video');

              return (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  className="group relative aspect-square rounded-[10px] overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:shadow-xl border hover:border-[#38bdf8]"
                  style={{
                    backgroundColor: 'var(--tile)',
                    borderColor: 'var(--line)',
                  }}
                  title={`${file.name} - Click to open viewer`}
                >
                  {/* Media Content */}
                  {isVideo ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black/40">
                      {file.dataUrl && !file.url?.startsWith('http') ? (
                        <img
                          src={file.dataUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <video
                          src={file.url || file.dataUrl}
                          poster={file.dataUrl}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-black/60 text-[#38bdf8] flex items-center justify-center backdrop-blur-xs shadow">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute top-1.5 right-1.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-white flex items-center gap-1 border border-white/10">
                        <Film className="w-2.5 h-2.5 text-[#38bdf8]" /> Video
                      </span>
                      {/* Video duration pill */}
                      {file.duration && (
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/85 text-white flex items-center gap-1 border border-white/10 shadow">
                          <Timer className="w-2.5 h-2.5 text-[#38bdf8]" />
                          {formatVideoDuration(file.duration)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={file.url || file.dataUrl}
                        alt={file.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 right-1.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-white flex items-center gap-1 border border-white/10">
                        <ImageIcon className="w-2.5 h-2.5 text-[#38bdf8]" /> Photo
                      </span>
                    </div>
                  )}

                  {/* Porn Shorts Badge */}
                  {file.category === 'Porn Shorts' && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#15264f] text-[#38bdf8] border border-[#1e3875] shadow-md flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 fill-current" /> Short
                    </span>
                  )}

                  {/* Price Tag (for Porn Movies or priced content) */}
                  {file.price !== undefined && file.price > 0 && (
                    <span className="absolute top-1.5 left-1.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#38bdf8] text-[#070d1e] shadow-md flex items-center">
                      ${file.price.toFixed(2)}
                    </span>
                  )}

                  {/* Porn Ad Badge */}
                  {file.isPornAd && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#c86d3b] text-white shadow-md flex items-center gap-0.5">
                      <Megaphone className="w-2.5 h-2.5" /> Ad
                    </span>
                  )}

                  {/* Game Badge */}
                  {file.category === 'Porn Games' && !file.price && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#3b281f] text-[#e2a049] border border-[#6d4a37]">
                      Playable
                    </span>
                  )}

                  {/* Delete button (if user is logged in or owner) */}
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${file.name}" from ${category}?`)) {
                          onDeleteFile(file.id);
                        }
                      }}
                      className="absolute top-8 left-1.5 p-1 rounded bg-black/80 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-10"
                      title="Delete item"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* File Name Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-2 pt-4 text-white text-[11px] leading-tight">
                    <div className="font-semibold truncate">{file.name}</div>
                    <div className="text-[9.5px] opacity-75 truncate text-[#bfa59a] flex items-center justify-between mt-0.5">
                      <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                      {file.comments && file.comments.length > 0 && (
                        <span className="flex items-center gap-0.5 text-[#e2a049]">
                          <MessageSquare className="w-2.5 h-2.5" /> {file.comments.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            id="folderEmpty"
            className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 text-[#94a3b8]"
          >
            <div className="w-14 h-14 rounded-full mb-3 flex items-center justify-center bg-[#15264f] border border-[#1e3875] text-[#38bdf8]">
              {category === 'Porn Videos' ? (
                <Megaphone className="w-7 h-7" />
              ) : (
                <Film className="w-7 h-7" />
              )}
            </div>

            <p className="text-base font-semibold text-white m-0">
              No contents uploaded yet in {category}.
            </p>
            <p className="text-xs opacity-75 mt-1 max-w-sm mb-4 text-[#94a3b8]">
              {category === 'Porn Videos'
                ? 'Click "Fetch Available Ads" to instantly load sponsored adult video ads into this page, or upload your own porn ads.'
                : user
                ? 'Use the drop zone above or the bottom plus button (+) to upload contents for this page.'
                : 'Sign in to be the first to upload contents to this folder page.'}
            </p>

            {category === 'Porn Videos' && onFetchPornAds && (
              <button
                onClick={() => onFetchPornAds()}
                disabled={isFetchingAds}
                className="py-2.5 px-6 rounded-full text-xs font-bold bg-white text-[#070d1e] hover:bg-slate-100 transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingAds ? 'animate-spin' : ''}`} />
                <span>Fetch Available Adult Video Ads</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating Plus Sign Button at bottom center for Signed In Users */}
      {user && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <button
            onClick={() => floatingFileInputRef.current?.click()}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/60 hover:bg-slate-100 group"
            style={{
              backgroundColor: 'var(--btn)',
              color: 'var(--btnink)',
            }}
            title={`Upload new ${category} contents`}
            aria-label={`Upload to ${category}`}
          >
            <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <span className="mt-1 text-[10px] font-bold tracking-wider uppercase text-[#38bdf8] bg-[#070d1e]/90 px-2 py-0.5 rounded-full border border-[#1e3875] backdrop-blur-xs">
            Add to {category}
          </span>
          <input
            ref={floatingFileInputRef}
            type="file"
            multiple
            accept={
              category === 'Porn Shorts'
                ? 'video/*'
                : category === 'Porn Images'
                ? 'image/*'
                : category === 'Porn Movies' || category === 'Porn Videos'
                ? 'video/*'
                : category === 'Porn Games'
                ? '*/*'
                : 'image/*,video/*'
            }
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Modal for setting price or extra metadata */}
      {isUploadModalOpen && stagedFiles.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
        >
          <div
            className="w-full max-w-[420px] rounded-xl p-6 shadow-2xl border"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--line)',
              color: 'var(--ink)',
            }}
          >
            <h2 className="text-lg font-bold text-white m-0 mb-1">
              Upload Details: {category}
            </h2>
            <p className="text-xs text-[#94a3b8] m-0 mb-4">
              Staging {stagedFiles.length} file{stagedFiles.length > 1 ? 's' : ''}:{' '}
              <span className="text-white font-medium">{stagedFiles[0].name}</span>
            </p>

            {/* Porn Shorts Duration Rule Notice */}
            {category === 'Porn Shorts' && (
              <div className="mb-4 p-3.5 rounded-lg bg-[#15264f] border border-[#1e3875]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#38bdf8] mb-1">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Porn Shorts Duration Rule:</span>
                </div>
                <p className="text-[11px] text-[#94a3b8] m-0 leading-relaxed">
                  Only adult video clips strictly under 3 minutes (max 180 seconds) are accommodated. Videos longer than 180 seconds are automatically rejected.
                </p>
              </div>
            )}

            {/* Price Setter for Porn Movies */}
            {category === 'Porn Movies' && (
              <div className="mb-4 p-3.5 rounded-lg bg-[#15264f] border border-[#1e3875]">
                <label className="block text-xs font-bold text-[#38bdf8] mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Set Price Per Movie (Optional):
                </label>
                <p className="text-[11px] text-[#94a3b8] mb-2">
                  As a signed-in creator, you can set a custom purchase or streaming price for this adult movie.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="0.00 (Free)"
                    className="w-full p-2 text-sm rounded bg-[#070d1e] border border-[#1e3875] text-white outline-none"
                  />
                </div>
                <span className="text-[10px] text-[#94a3b8] mt-1 block">
                  {parseFloat(customPrice) > 0
                    ? `Users will see this movie priced at $${parseFloat(customPrice).toFixed(2)}`
                    : 'Leave at $0 for free viewing'}
                </span>
              </div>
            )}

            {/* Porn Ads Confirmation for Porn Videos */}
            {category === 'Porn Videos' && (
              <div className="mb-4 p-3.5 rounded-lg bg-[#15264f] border border-[#1e3875]">
                <label className="flex items-start gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPornAdChecked}
                    onChange={(e) => setIsPornAdChecked(e.target.checked)}
                    className="mt-0.5 rounded accent-[#38bdf8]"
                  />
                  <div>
                    <span>Confirm as Porn Ad Video</span>
                    <p className="text-[11px] text-[#94a3b8] font-normal mt-0.5 m-0">
                      This page hosts promotional adult ads, commercial clips & sponsor trailers.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Porn Games Platform Details */}
            {category === 'Porn Games' && (
              <div className="mb-4 p-3.5 rounded-lg bg-[#15264f] border border-[#1e3875]">
                <label className="block text-xs font-bold text-[#38bdf8] mb-1">
                  Target Platform:
                </label>
                <select
                  value={gamePlatform}
                  onChange={(e) => setGamePlatform(e.target.value)}
                  className="w-full p-2 text-xs rounded bg-[#070d1e] border border-[#1e3875] text-white outline-none"
                >
                  <option value="PC / Windows (.exe / .zip)">PC / Windows (.exe / .zip)</option>
                  <option value="Web Browser / HTML5">Web Browser / HTML5 (.html / .zip)</option>
                  <option value="Android (.apk)">Android (.apk)</option>
                  <option value="Mac / Universal">Mac / Universal</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setStagedFiles([]);
                  setIsUploadModalOpen(false);
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white text-white hover:text-[#070d1e] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmModalUpload}
                className="px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md hover:bg-slate-100 flex items-center gap-1.5"
                style={{
                  backgroundColor: 'var(--btn)',
                  color: 'var(--btnink)',
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Upload</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
