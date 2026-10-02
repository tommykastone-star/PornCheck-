import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppScreen,
  BrowseMode,
  CategoryName,
  MediaFile,
  UserAccount,
} from './types';
import {
  CATEGORIES,
  getSmartCategorySuggestions,
  predictCategoryForFile,
  validateFileForCategory,
  getVideoDuration,
} from './data/categories';
import {
  loadAllMediaFilesFromDB,
  saveMediaFileToDB,
  deleteMediaFileFromDB,
  clearAllMediaFilesFromDB,
  clearCategoryFilesFromDB,
} from './services/storage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AgeGate } from './components/AgeGate';
import { LeaveScreen } from './components/LeaveScreen';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { FolderView } from './components/FolderView';
import { MediaLightbox } from './components/MediaLightbox';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AVAILABLE_PORN_ADS, createAdMediaFile } from './data/pornAds';
import { Sparkles, Compass, Info, CheckCircle2, UserPlus, Flame } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [currentFolder, setCurrentFolder] = useState<CategoryName | null>(null);

  // "The manual mode is the mode where you land when entering the website or when you click on 'Manual Mode' where non-AI contents are hosted."
  // "The AI mode is the mode where you land when you click on the 'AI Mode' where only AI contents are hosted."
  const [browseMode, setBrowseMode] = useState<BrowseMode>('manual');

  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFileForModal, setSelectedFileForModal] = useState<MediaFile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isFetchingAds, setIsFetchingAds] = useState(false);

  // Initialize data and user
  useEffect(() => {
    // User setup
    try {
      const storedUser = localStorage.getItem('pc_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to parse user from localStorage', e);
    }

    // Load persisted files from IndexedDB and clean up legacy categories
    loadAllMediaFilesFromDB().then((loaded) => {
      if (loaded && loaded.length > 0) {
        const legacyFiles = loaded.filter((f) => (f.category as string) === 'Live Porn');
        if (legacyFiles.length > 0) {
          legacyFiles.forEach((f) => deleteMediaFileFromDB(f.id));
        }
        const remaining = loaded.filter((f) => (f.category as string) !== 'Live Porn');
        setFiles(remaining);
      }
    });

    // Also directly purge any legacy Live Porn records from IndexedDB
    clearCategoryFilesFromDB('Live Porn' as any);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Welcome transition handler: 3 seconds to home screen
  const handleWelcomeProceed = useCallback(() => {
    let verified = false;
    try {
      verified = sessionStorage.getItem('pc-18') === '1';
    } catch {
      verified = false;
    }
    setScreen(verified ? 'home' : 'gate');
  }, []);

  const handleAgeConfirm = () => {
    try {
      sessionStorage.setItem('pc-18', '1');
    } catch (e) {
      console.warn('Could not set session storage', e);
    }
    setScreen('home');
  };

  const handleAgeReject = () => {
    try {
      sessionStorage.removeItem('pc-18');
    } catch (e) {
      console.warn('Could not remove session storage', e);
    }
    setScreen('leave');
  };

  const handleLockSession = () => {
    try {
      sessionStorage.removeItem('pc-18');
    } catch (e) {
      console.warn(e);
    }
    setScreen('gate');
    showNotification('Session locked. Re-verification required.');
  };

  // Filter files by the current BrowseMode (Manual vs AI)
  // "The manual mode is the mode where you land when entering the website or when you click on 'Manual Mode' where non-AI contents are hosted.
  // The AI mode is the mode where you land when you click on the 'AI Mode' where only AI contents are hosted."
  const modeFiles = useMemo(() => {
    return files.filter((f) => (f.mode || 'manual') === browseMode);
  }, [files, browseMode]);

  // Compute file counts per category for the current mode
  const fileCounts = useMemo(() => {
    const counts: Record<CategoryName, number> = {
      All: modeFiles.length,
      'Porn Shorts': 0,
      'Porn Movies': 0,
      'Porn Images': 0,
      'Porn Games': 0,
      'Back Shots': 0,
      'Porn Videos': 0,
      'Oral Sex': 0,
      'Anal Sex': 0,
      'Pussy Sex': 0,
      Gays: 0,
      Lesbian: 0,
      'Dolls Sex': 0,
      'Toys Sex': 0,
      'Animation Sex': 0,
    };

    modeFiles.forEach((f) => {
      if (counts[f.category] !== undefined) {
        counts[f.category]++;
      }
    });
    return counts;
  }, [modeFiles]);

  // Find the newest uploaded content for each folder to display on folder button icons
  // "The newest uploaded content must show on the folder button icons on the Home Screen in the website."
  const latestFilesMap = useMemo(() => {
    const map: Record<CategoryName, MediaFile | undefined> = {
      All: undefined,
      'Porn Shorts': undefined,
      'Porn Movies': undefined,
      'Porn Images': undefined,
      'Porn Games': undefined,
      'Back Shots': undefined,
      'Porn Videos': undefined,
      'Oral Sex': undefined,
      'Anal Sex': undefined,
      'Pussy Sex': undefined,
      Gays: undefined,
      Lesbian: undefined,
      'Dolls Sex': undefined,
      'Toys Sex': undefined,
      'Animation Sex': undefined,
    };

    // Sort all files descending by addedAt
    const sorted = [...modeFiles].sort((a, b) => b.addedAt - a.addedAt);

    if (sorted.length > 0) {
      map['All'] = sorted[0];
    }

    sorted.forEach((item) => {
      if (!map[item.category]) {
        map[item.category] = item;
      }
    });

    return map;
  }, [modeFiles]);

  // AI suggestions based on search query
  const aiSuggestedCategories = useMemo(() => {
    if (browseMode !== 'ai' || !searchQuery.trim()) return [];
    return getSmartCategorySuggestions(searchQuery);
  }, [browseMode, searchQuery]);

  const aiSuggestedNames = useMemo(() => {
    return new Set(aiSuggestedCategories.map((c) => c.name));
  }, [aiSuggestedCategories]);

  // Filter categories according to search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CATEGORIES;

    if (browseMode === 'ai') {
      return CATEGORIES.filter((cat) => {
        const nameMatch = cat.name.toLowerCase().includes(q);
        const aiMatch = aiSuggestedNames.has(cat.name);
        return nameMatch || aiMatch;
      });
    } else {
      return CATEGORIES.filter((cat) => cat.name.toLowerCase().includes(q));
    }
  }, [searchQuery, browseMode, aiSuggestedNames]);

  // Open a specific category folder page
  const handleOpenFolder = (catName: CategoryName) => {
    setCurrentFolder(catName);
    setScreen('folder');
  };

  // Upload handler with category enforcement, movie price setting, and porn ads
  const handleAddFiles = async (
    newFiles: FileList | File[],
    targetCategory: CategoryName,
    options?: {
      price?: number;
      isPornAd?: boolean;
      gamePlatform?: string;
    }
  ) => {
    const fileArray = Array.from(newFiles);
    const addedItems: MediaFile[] = [];

    for (const file of fileArray) {
      let fileDuration: number | undefined = undefined;
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|mkv|avi)$/i)) {
        fileDuration = await getVideoDuration(file);
      }

      // Validate category rule (including videos below 3 minutes for Porn Shorts)
      const validation = validateFileForCategory(file, targetCategory, {
        isPornAd: options?.isPornAd,
        duration: fileDuration,
      });

      if (!validation.valid) {
        showNotification(validation.reason || `Invalid content for "${targetCategory}".`);
        continue;
      }

      let resolvedCategory = targetCategory;
      if (targetCategory === 'All') {
        if (browseMode === 'ai') {
          resolvedCategory = predictCategoryForFile(file.name, file.type);
        } else {
          resolvedCategory = file.type.startsWith('video/') ? 'Porn Movies' : 'Porn Images';
        }
      }

      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const objectUrl = URL.createObjectURL(file);

      const mediaItem: MediaFile = {
        id,
        name: file.name,
        type: file.type || (file.name.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'),
        category: resolvedCategory,
        size: file.size,
        addedAt: Date.now(),
        mode: browseMode,
        blob: file,
        url: objectUrl,
        duration: fileDuration,
        price: options?.price,
        isPornAd: resolvedCategory === 'Porn Videos' ? true : options?.isPornAd,
        gameData:
          resolvedCategory === 'Porn Games'
            ? { platform: options?.gamePlatform || 'Universal' }
            : undefined,
        comments: [],
        uploaderEmail: user?.email,
        uploaderName: user?.name,
      };

      await saveMediaFileToDB(mediaItem);
      addedItems.push(mediaItem);
    }

    if (addedItems.length > 0) {
      setFiles((prev) => [...prev, ...addedItems]);
      showNotification(
        `Added ${addedItems.length} item${addedItems.length > 1 ? 's' : ''} to ${targetCategory} (${browseMode === 'ai' ? 'AI' : 'Manual'} Mode)`
      );
    }
  };

  // Fetch available pornography ads into Porn Videos folder page
  const handleFetchPornAds = async () => {
    setIsFetchingAds(true);
    showNotification('Fetching available pornography ads from sponsor network...');

    try {
      // Filter ads relevant to the current mode (or both)
      const targetAds = AVAILABLE_PORN_ADS.filter(
        (ad) => ad.mode === browseMode || ad.mode === 'manual'
      );

      const generatedAdFiles: MediaFile[] = [];

      for (const ad of targetAds) {
        // Avoid duplicate ad IDs if already in files
        const alreadyExists = files.some((f) => f.name.includes(ad.adTitle));
        if (!alreadyExists) {
          const adFile = await createAdMediaFile(ad);
          await saveMediaFileToDB(adFile);
          generatedAdFiles.push(adFile);
        }
      }

      if (generatedAdFiles.length > 0) {
        setFiles((prev) => [...prev, ...generatedAdFiles]);
        showNotification(`Successfully fetched ${generatedAdFiles.length} pornography ads!`);
      } else {
        showNotification('All latest pornography ads are already loaded in this folder.');
      }
    } catch (err) {
      console.warn('Failed to fetch ads:', err);
      showNotification('Failed to fetch pornography ads. Please try again.');
    } finally {
      setIsFetchingAds(false);
    }
  };

  // Delete file handler
  const handleDeleteFile = async (id: string) => {
    await deleteMediaFileFromDB(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFileForModal?.id === id) {
      setSelectedFileForModal(null);
    }
    showNotification('Item removed from website.');
  };

  // Clear all files in a specific category (e.g. "Live Porn")
  const handleClearCategory = async (catName: CategoryName) => {
    await clearCategoryFilesFromDB(catName);
    setFiles((prev) => prev.filter((f) => f.category !== catName));
    showNotification(`Removed everything in "${catName}".`);
  };

  // Move category handler
  const handleMoveCategory = async (id: string, newCategory: CategoryName) => {
    const updated = files.map((f) => {
      if (f.id === id) {
        const revised = { ...f, category: newCategory };
        saveMediaFileToDB(revised);
        return revised;
      }
      return f;
    });
    setFiles(updated);
    if (selectedFileForModal?.id === id) {
      setSelectedFileForModal((prev) => (prev ? { ...prev, category: newCategory } : null));
    }
    showNotification(`Moved to ${newCategory}`);
  };

  // Toggle favorite handler
  const handleToggleFavorite = (id: string) => {
    const updated = files.map((f) => {
      if (f.id === id) {
        const revised = { ...f, isFavorite: !f.isFavorite };
        saveMediaFileToDB(revised);
        return revised;
      }
      return f;
    });
    setFiles(updated);
    if (selectedFileForModal?.id === id) {
      setSelectedFileForModal((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Add Comment handler
  const handleAddComment = async (fileId: string, commentText: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    const newComment = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userName: user.name || user.email.split('@')[0],
      userEmail: user.email,
      text: commentText,
      createdAt: Date.now(),
    };

    const updated = files.map((f) => {
      if (f.id === fileId) {
        const revised = {
          ...f,
          comments: [...(f.comments || []), newComment],
        };
        saveMediaFileToDB(revised);
        return revised;
      }
      return f;
    });

    setFiles(updated);
    if (selectedFileForModal?.id === fileId) {
      setSelectedFileForModal((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), newComment],
            }
          : null
      );
    }
    showNotification('Comment posted.');
  };

  // Erase all data
  const handleClearAllData = async () => {
    await clearAllMediaFilesFromDB();
    setFiles([]);
    showNotification('All website media cleared.');
  };

  // Sign out
  const handleSignOut = () => {
    localStorage.removeItem('pc_user');
    setUser(null);
    showNotification('Signed out. You can still watch & search for free.');
  };

  // Screens
  if (screen === 'welcome') {
    return <WelcomeScreen onProceed={handleWelcomeProceed} />;
  }

  if (screen === 'gate') {
    return <AgeGate onConfirm={handleAgeConfirm} onReject={handleAgeReject} />;
  }

  if (screen === 'leave') {
    return <LeaveScreen onReturn={() => setScreen('gate')} />;
  }

  if (screen === 'folder' && currentFolder) {
    return (
      <>
        <FolderView
          category={currentFolder}
          files={modeFiles}
          onBack={() => setScreen('home')}
          onAddFiles={handleAddFiles}
          onFetchPornAds={handleFetchPornAds}
          isFetchingAds={isFetchingAds}
          onDeleteFile={handleDeleteFile}
          onSelectFile={(f) => setSelectedFileForModal(f)}
          isAiMode={browseMode === 'ai'}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onClearCategory={handleClearCategory}
        />

        <MediaLightbox
          file={selectedFileForModal}
          onClose={() => setSelectedFileForModal(null)}
          onDelete={handleDeleteFile}
          onMoveCategory={handleMoveCategory}
          onToggleFavorite={handleToggleFavorite}
          onAddComment={handleAddComment}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      </>
    );
  }

  // Home Screen with rich navy blue background
  return (
    <div
      className="min-h-screen flex flex-col transition-colors selection:bg-[#38bdf8] selection:text-[#070d1e]"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl border animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--line)',
            color: 'var(--ink)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        user={user}
        browseMode={browseMode}
        onToggleMode={setBrowseMode}
        onLogoClick={() => {
          setSearchQuery('');
          setCurrentFolder(null);
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-[1020px] w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col">
        {/* Modes Toggle: Manual Mode (Default) vs AI Mode with White Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <button
            id="manual"
            onClick={() => setBrowseMode('manual')}
            className={`py-3 sm:py-3.5 px-4 rounded-full text-sm sm:text-[17px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm border-2 ${
              browseMode === 'manual'
                ? 'bg-white text-[#070d1e] border-white shadow-md scale-[1.01]'
                : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Manual Mode</span>
            <span className="text-[10px] sm:text-xs opacity-80 font-normal ml-0.5 hidden xs:inline">
              (Non-AI Content)
            </span>
          </button>

          <button
            id="ai"
            onClick={() => setBrowseMode('ai')}
            className={`py-3 sm:py-3.5 px-4 rounded-full text-sm sm:text-[17px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm border-2 ${
              browseMode === 'ai'
                ? 'bg-white text-[#070d1e] border-white shadow-md scale-[1.01]'
                : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#38bdf8]" />
            <span>AI Mode</span>
            <span className="text-[10px] sm:text-xs opacity-80 font-normal ml-0.5 hidden xs:inline">
              (AI Contents Only)
            </span>
          </button>
        </div>

        {/* Mode Status Pill Banner */}
        <div className="mb-4 flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-[#0f1b38] border border-[#1e3875] text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
            <span>
              Currently viewing:{' '}
              <b className="text-white">
                {browseMode === 'manual' ? 'Manual Non-AI Adult Vault' : 'AI-Generated Adult Vault'}
              </b>
            </span>
          </div>
          <span className="text-[11px] text-[#38bdf8] font-semibold">
            {modeFiles.length} {modeFiles.length === 1 ? 'file' : 'files'} in this mode
          </span>
        </div>

        {/* AI Quick Query suggestion bar when in AI Mode - White Buttons */}
        {browseMode === 'ai' && !searchQuery && (
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-[#38bdf8] shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Keywords:
            </span>
            {['Anime & Hentai', 'CGI 3D Games', 'Live Stream Ads', 'Virtual Novel', 'Realistic AI Photos'].map(
              (sample) => (
                <button
                  key={sample}
                  onClick={() => setSearchQuery(sample.toLowerCase())}
                  className="px-3 py-1 rounded-full bg-white text-[#070d1e] font-semibold shrink-0 hover:bg-slate-100 shadow-xs transition-colors cursor-pointer text-[11px]"
                >
                  {sample}
                </button>
              )
            )}
          </div>
        )}

        {/* Category Grid with latest uploaded content on icons */}
        <CategoryGrid
          categories={filteredCategories}
          fileCounts={fileCounts}
          latestFilesMap={latestFilesMap}
          onSelectCategory={handleOpenFolder}
          aiSuggestedNames={aiSuggestedNames}
          isAiMode={browseMode === 'ai'}
          searchQuery={searchQuery}
        />

        {/* Empty state if search finds nothing */}
        {filteredCategories.length === 0 && (
          <p
            id="empty"
            className="text-center py-12 text-sm font-medium text-[#94a3b8]"
          >
            No categories match your search "{searchQuery}".
          </p>
        )}

        {/* Info panel explaining rules and modes */}
        <div
          id="panel"
          className="mt-7 p-4 sm:p-5 rounded-[12px] text-xs sm:text-sm leading-relaxed border border-dashed transition-colors"
          style={{
            borderColor: 'var(--line)',
            backgroundColor: 'var(--card)',
            color: 'var(--mute)',
          }}
        >
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#38bdf8] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <div>
                <b className="text-white">Click any folder icon</b> above to enter its dedicated
                page. Newest uploaded contents automatically appear as the icon on each button.
              </div>
              <div className="text-[12px] opacity-80 text-[#94a3b8]">
                • <b>Porn Movies:</b> Logged-in users can set custom purchase or stream prices per movie.<br />
                • <b>Porn Videos:</b> Dedicated porn ads videos page.<br />
                • <b>Porn Games:</b> Upload your interactive adult games, packages & dating sims.<br />
                • <b>Free Access:</b> Watching & searching is 100% free with no sign-up required. Sign up to upload, set movie prices, download, comment, and save favorites.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Account / Sign-Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(acc) => {
          setUser(acc);
          showNotification(`Welcome, ${acc.name || acc.email}! You can now upload and interact.`);
        }}
      />

      {/* Profile & Vault Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        files={files}
        onSignOut={handleSignOut}
        onClearAllData={handleClearAllData}
        onLockSession={handleLockSession}
        onUpdateUser={(updated) => {
          setUser(updated);
          showNotification('Profile face photo updated successfully!');
        }}
      />

      {/* Offline Indicator Banner */}
      <OfflineIndicator />
    </div>
  );
}
