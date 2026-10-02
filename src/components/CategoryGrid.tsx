import React from 'react';
import { CategoryInfo, formatVideoDuration } from '../data/categories';
import { CategoryName, MediaFile } from '../types';
import { Sparkles, Layers, Play, DollarSign, Gamepad2, Megaphone, Timer, Zap } from 'lucide-react';

interface CategoryGridProps {
  categories: CategoryInfo[];
  fileCounts: Record<CategoryName, number>;
  latestFilesMap: Record<CategoryName, MediaFile | undefined>;
  onSelectCategory: (name: CategoryName) => void;
  aiSuggestedNames: Set<CategoryName>;
  isAiMode: boolean;
  searchQuery: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  fileCounts,
  latestFilesMap,
  onSelectCategory,
  aiSuggestedNames,
  isAiMode,
  searchQuery,
}) => {
  const renderFallbackIcon = (cat: CategoryInfo) => {
    if (cat.name === 'Porn Shorts') {
      return (
        <div className="flex flex-col items-center justify-center">
          <Zap className="w-7 h-7 text-[#38bdf8] mb-1 fill-current opacity-90" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8]">&lt; 3 MIN</span>
        </div>
      );
    }
    if (cat.name === 'Porn Games') {
      return <Gamepad2 className="w-[42%] h-[42%] opacity-65 text-[#e2a049]" />;
    }
    if (cat.name === 'Porn Videos') {
      return (
        <div className="flex flex-col items-center justify-center">
          <Megaphone className="w-6 h-6 opacity-80 text-[#e2a049] mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#bfa59a]">ADS</span>
        </div>
      );
    }
    if (cat.name === 'All') {
      return <Layers className="w-[38%] h-[38%] opacity-60 text-[#bfa59a]" />;
    }
    if (cat.type === 'img') {
      return (
        <svg viewBox="0 0 24 24" className="w-[38%] opacity-60 fill-current text-[#bfa59a]">
          <path d="M3 4h18v16H3V4zm2 2v9l4-4 3 3 4-5 3 4V6H5z" />
        </svg>
      );
    }
    // film / video default
    return (
      <svg viewBox="0 0 24 24" className="w-[38%] opacity-60 fill-current text-[#bfa59a]">
        <path d="M4 4h16v16H4V4zm2 2v2h2V6H6zm0 4v2h2v-2H6zm0 4v2h2v-2H6zm10-8v2h2V6h-2zm0 4v2h2v-2h-2zm0 4v2h2v-2h-2zM10 8v8l5-4-5-4z" />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4.5 md:gap-6">
      {categories.map((cat) => {
        const count = fileCounts[cat.name] || 0;
        const isAiSuggested = isAiMode && searchQuery.trim() !== '' && aiSuggestedNames.has(cat.name);
        const latestFile = latestFilesMap[cat.name];
        const isVideo = latestFile?.type.startsWith('video');

        return (
          <button
            key={cat.name}
            data-name={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className="group relative flex flex-col items-center text-center p-0 border-0 bg-transparent cursor-pointer transition-transform hover:-translate-y-1 active:translate-y-0 focus:outline-none w-full"
            style={{ color: 'var(--ink)' }}
            title={`${cat.name} (${count} items) - Click to view ${cat.name} page`}
          >
            {/* AI Suggested Indicator */}
            {isAiSuggested && (
              <span
                className="absolute -top-1.5 -right-1.5 z-20 flex items-center justify-center p-1 rounded-full shadow-lg border border-[#1e3875]"
                style={{
                  backgroundColor: 'var(--btn)',
                  color: 'var(--btnink)',
                }}
                title="AI Recommended for your search"
              >
                <Sparkles className="w-2.5 h-2.5 animate-pulse text-[#38bdf8]" />
              </span>
            )}

            {/* Folder button icon showing newest uploaded content */}
            <div
              className={`w-full aspect-[4/3] sm:aspect-square rounded-xl flex items-center justify-center mb-2 transition-all relative overflow-hidden shadow-sm group-hover:border-[#38bdf8] group-hover:shadow-md ${
                isAiSuggested ? 'ring-2 ring-[#38bdf8]' : ''
              }`}
              style={{
                backgroundColor: 'var(--tile)',
                border: '1.5px solid var(--line)',
              }}
            >
              {/* If newest uploaded content exists, display it on the folder button icon! */}
              {latestFile && (latestFile.url || latestFile.dataUrl) ? (
                <div className="w-full h-full relative">
                  {isVideo ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black/40">
                      <video
                        src={latestFile.url || latestFile.dataUrl}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-black/60 text-[#38bdf8] flex items-center justify-center backdrop-blur-xs">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={latestFile.url || latestFile.dataUrl}
                      alt={latestFile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}

                  {/* "NEW" tag indicating latest uploaded content */}
                  <span className="absolute top-1 left-1 text-[8.5px] font-black uppercase px-1 py-0.2 rounded bg-white text-[#070d1e] shadow-xs">
                    NEW
                  </span>

                  {/* Video duration pill if available */}
                  {latestFile?.duration && (
                    <span className="absolute bottom-1 right-1 text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-black/85 text-white border border-white/10 flex items-center gap-0.5">
                      <Timer className="w-2.5 h-2.5 text-[#38bdf8]" />
                      {formatVideoDuration(latestFile.duration)}
                    </span>
                  )}
                </div>
              ) : (
                /* Fallback category icon */
                <div className="w-full h-full flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-200">
                  {renderFallbackIcon(cat)}
                </div>
              )}

              {/* Special Badges: Price badge for Movies, Ads badge for Videos, <3 min badge for Shorts */}
              {cat.name === 'Porn Shorts' && (
                <span
                  className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--line)',
                    color: '#38bdf8',
                  }}
                  title="Porn Shorts: Videos strictly under 3 minutes"
                >
                  <Timer className="w-2.5 h-2.5" /> &lt;3 min
                </span>
              )}

              {cat.name === 'Porn Movies' && (
                <span
                  className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--line)',
                    color: '#38bdf8',
                  }}
                  title="Porn Movies with custom pricing"
                >
                  <DollarSign className="w-2.5 h-2.5" /> Set Price
                </span>
              )}

              {cat.name === 'Porn Videos' && (
                <span
                  className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--line)',
                    color: '#38bdf8',
                  }}
                  title="Porn Ads Videos Page"
                >
                  Ads
                </span>
              )}

              {/* File count indicator */}
              {count > 0 && (
                <span
                  className="absolute bottom-1 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded leading-none border shadow-xs"
                  style={{
                    backgroundColor: 'var(--card)',
                    color: 'var(--ink)',
                    borderColor: 'var(--line-strong)',
                  }}
                >
                  {count}
                </span>
              )}
            </div>

            {/* Folder Name text */}
            <span className="text-xs sm:text-sm font-bold leading-tight group-hover:text-[#e2a049] transition-colors max-w-full truncate px-1">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
