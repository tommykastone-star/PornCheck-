import { CategoryName } from '../types';

export interface CategoryInfo {
  name: CategoryName;
  type: 'film' | 'img' | 'game' | 'collection';
  description: string;
  keywords: string[];
  acceptDescription: string;
  acceptRule: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'All',
    type: 'collection',
    description: 'Complete library of adult media across all categories',
    keywords: ['everything', 'library', 'all', 'total', 'collection'],
    acceptDescription: 'Any valid adult media files (photos, videos, clips)',
    acceptRule: 'images or videos',
  },
  {
    name: 'Porn Shorts',
    type: 'film',
    description: 'Short adult video clips, reels & quick highlights under 3 minutes (max 180 seconds).',
    keywords: ['shorts', 'short', 'reel', 'reels', 'clip', 'quick', 'highlight', 'under 3 min', 'tiktok', 'snackable'],
    acceptDescription: 'Adult video files strictly below 3 minutes in length (max 180 seconds)',
    acceptRule: 'video files under 3 minutes only',
  },
  {
    name: 'Porn Movies',
    type: 'film',
    description: 'Full-length cinematic adult films, series, and studio productions. Logged-in users can set custom pricing.',
    keywords: ['movie', 'full', 'film', 'cinema', 'feature', 'studio', 'dvd', 'price'],
    acceptDescription: 'Full-length adult movies & cinema productions (pricing allowed for signed in users)',
    acceptRule: 'video files only (supports price per movie)',
  },
  {
    name: 'Porn Images',
    type: 'img',
    description: 'High-resolution adult photo sets, model shoots, galleries, and stills',
    keywords: ['image', 'photo', 'picture', 'still', 'gallery', 'wallpaper', 'art'],
    acceptDescription: 'Adult photographs, high-res pictures, and image gallery stills only',
    acceptRule: 'image files only (.jpg, .png, .webp, etc.)',
  },
  {
    name: 'Porn Games',
    type: 'game',
    description: 'Interactive adult games, dating sims, downloadable game packages (.zip, .html, .apk, .exe, images)',
    keywords: ['game', 'interactive', 'visual novel', 'sim', 'rpg', '3d game', 'play', 'zip', 'apk'],
    acceptDescription: 'Playable adult games, visual novel bundles, simulators, or game packages (.zip, .html, .apk, .png)',
    acceptRule: 'game files, archives, or game media',
  },
  {
    name: 'Back Shots',
    type: 'film',
    description: 'Rear angle, POV, doggystyle perspectives, and behind views',
    keywords: ['back', 'rear', 'doggystyle', 'pov', 'angle', 'behind', 'back shots'],
    acceptDescription: 'Back shots, doggystyle, and rear-angle POV videos and captures only',
    acceptRule: 'videos or images focused on rear/back angle',
  },
  {
    name: 'Porn Videos',
    type: 'film',
    description: 'Porn ads videos page. Allows users to upload and view promotional adult ads & sponsor clips.',
    keywords: ['video', 'clip', 'ad', 'ads', 'commercial', 'sponsor', 'promo', 'trailer'],
    acceptDescription: 'Porn ads videos only (commercials, sponsor promotions, previews & trailers)',
    acceptRule: 'video files only (must be adult ads / promo content)',
  },
  {
    name: 'Oral Sex',
    type: 'film',
    description: 'Blowjobs, cunnilingus, deepthroat, and oral focus content',
    keywords: ['oral', 'blowjob', 'bj', 'cunnilingus', 'deepthroat', 'mouth', 'lick'],
    acceptDescription: 'Oral sex videos and captures (blowjobs, cunnilingus, mouth play) only',
    acceptRule: 'videos or photos highlighting oral sex',
  },
  {
    name: 'Anal Sex',
    type: 'img',
    description: 'Anal scenes, close-ups, and specialized backdoor content',
    keywords: ['anal', 'backdoor', 'tight', 'ass', 'butt'],
    acceptDescription: 'Anal sex scenes, close-ups, and photos/videos only',
    acceptRule: 'videos or photos dedicated to anal sex',
  },
  {
    name: 'Pussy Sex',
    type: 'img',
    description: 'Sensual intimacy, vaginal intercourse, and close encounters',
    keywords: ['pussy', 'vaginal', 'intimate', 'straight', 'intercourse', 'sensual'],
    acceptDescription: 'Vaginal sex, sensual intimacy, and vaginal intercourse media only',
    acceptRule: 'videos or photos of vaginal intercourse',
  },
  {
    name: 'Gays',
    type: 'film',
    description: 'Gay male adult cinema, couples, and solo productions',
    keywords: ['gay', 'gays', 'male', 'men', 'twink', 'bear', 'mm', 'guys'],
    acceptDescription: 'Gay male pornography and cinema content only',
    acceptRule: 'videos or photos featuring gay male content',
  },
  {
    name: 'Lesbian',
    type: 'film',
    description: 'Lesbian romance, female pairs, and sensual girl-on-girl',
    keywords: ['lesbian', 'girl', 'girls', 'female', 'ff', 'sapphic', 'women'],
    acceptDescription: 'Lesbian pornography and girl-on-girl erotic content only',
    acceptRule: 'videos or photos featuring lesbian content',
  },
  {
    name: 'Dolls Sex',
    type: 'film',
    description: 'Silicone dolls, realdolls, and synthetic models',
    keywords: ['doll', 'dolls', 'silicone', 'realdoll', 'mannequin', 'synthetic'],
    acceptDescription: 'Love dolls, silicone doll sex, and realdoll encounters only',
    acceptRule: 'videos or photos featuring adult dolls',
  },
  {
    name: 'Toys Sex',
    type: 'film',
    description: 'Vibrators, adult toys, dildos, and apparatus play',
    keywords: ['toy', 'toys', 'vibrator', 'dildo', 'wand', 'device', 'machine', 'gadget'],
    acceptDescription: 'Sex toys, dildos, vibrator demonstrations, and machine play only',
    acceptRule: 'videos or photos demonstrating adult toys',
  },
  {
    name: 'Animation Sex',
    type: 'film',
    description: 'Hentai, 2D/3D anime, SFM animation, and stylized adult art',
    keywords: ['animation', 'anime', 'hentai', 'cartoon', 'sfm', '3d anime', 'cgi', 'manga'],
    acceptDescription: 'Animated pornography (hentai, 2D/3D CGI, SFM, anime) only',
    acceptRule: 'animated videos or 2D/3D adult art',
  },
];

/**
 * Validates whether a file is accepted for a given category.
 * Enforces:
 * "The Folder buttons on the Home Screen only accepts contents according to their names below to be uploaded."
 * "Porn Games folder button must have the ability to upload my Porn Games inside it’s folder page"
 * "The 'Porn Videos' folder icon button on the website's Home Screen is connected to the page that contains porn ads videos... only allow uploading user to upload porn ads videos."
 */
export function validateFileForCategory(
  file: File,
  category: CategoryName,
  options?: { isPornAd?: boolean; duration?: number }
): { valid: boolean; reason?: string } {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (category === 'All') {
    return { valid: true };
  }

  // Porn Shorts: accommodating ONLY videos below 3 minutes (180 seconds)
  if (category === 'Porn Shorts') {
    const isVideo =
      type.startsWith('video/') ||
      name.endsWith('.mp4') ||
      name.endsWith('.webm') ||
      name.endsWith('.mov') ||
      name.endsWith('.mkv') ||
      name.endsWith('.avi');

    if (!isVideo) {
      return {
        valid: false,
        reason: 'Porn Shorts only accommodates video files below 3 minutes. Photos and other media are not accepted in this folder.',
      };
    }

    if (options?.duration !== undefined && options.duration > 180) {
      const minutes = Math.floor(options.duration / 60);
      const seconds = Math.round(options.duration % 60);
      return {
        valid: false,
        reason: `Porn Shorts only accommodates videos below 3 minutes (max 180s). This video is ${minutes}m ${seconds}s.`,
      };
    }

    return { valid: true };
  }

  // Porn Games: accepts game archives, html, exe, apk, or images/videos with game tags
  if (category === 'Porn Games') {
    const isGameExt =
      name.endsWith('.zip') ||
      name.endsWith('.rar') ||
      name.endsWith('.apk') ||
      name.endsWith('.exe') ||
      name.endsWith('.html') ||
      name.endsWith('.htm') ||
      name.endsWith('.swf') ||
      type.includes('zip') ||
      type.includes('package') ||
      type.includes('html') ||
      type.includes('octet-stream');

    const isGameMedia =
      type.startsWith('image/') || type.startsWith('video/') || isGameExt;

    if (!isGameMedia) {
      return {
        valid: false,
        reason: 'Porn Games only accepts game files (.zip, .apk, .html, .exe) or game gameplay recordings & screenshots.',
      };
    }
    return { valid: true };
  }

  // Porn Images: only image files accepted
  if (category === 'Porn Images') {
    if (!type.startsWith('image/')) {
      return {
        valid: false,
        reason: 'Porn Images only accepts photo and image files (.jpg, .png, .webp, .gif). For videos, upload to corresponding video categories.',
      };
    }
    return { valid: true };
  }

  // Porn Movies: only videos accepted
  if (category === 'Porn Movies') {
    if (!type.startsWith('video/')) {
      return {
        valid: false,
        reason: 'Porn Movies only accepts video files (.mp4, .webm, .mov, .mkv). Set prices per movie if needed.',
      };
    }
    return { valid: true };
  }

  // Porn Videos: ONLY allows uploading porn ads videos
  if (category === 'Porn Videos') {
    if (!type.startsWith('video/')) {
      return {
        valid: false,
        reason: 'Porn Videos page hosts porn ads videos only. Please upload a video file (.mp4, .webm, .mov).',
      };
    }
    // Must be flagged as porn ad or named with ad keywords
    if (options && options.isPornAd === false) {
      return {
        valid: false,
        reason: 'This page only allows uploading porn ads videos. Please check "Confirm as Porn Ad Video" before uploading.',
      };
    }
    return { valid: true };
  }

  // All other adult categories accept images or videos
  if (!type.startsWith('image/') && !type.startsWith('video/')) {
    return {
      valid: false,
      reason: `"${category}" only accepts adult media (video clips or photos) corresponding to ${category}.`,
    };
  }

  return { valid: true };
}

/**
 * Calculates video duration in seconds using HTML5 video metadata.
 */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv|avi)$/i)) {
      resolve(0);
      return;
    }
    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    video.onloadedmetadata = () => {
      cleanup();
      resolve(video.duration || 0);
    };

    video.onerror = () => {
      cleanup();
      resolve(0);
    };

    // Safety timeout in case video metadata event does not fire
    setTimeout(() => {
      cleanup();
      resolve(0);
    }, 3500);
  });
}

/**
 * Formats duration in seconds to mm:ss
 */
export function formatVideoDuration(seconds?: number): string {
  if (seconds === undefined || isNaN(seconds) || seconds <= 0) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * AI Smart Category Suggestion function.
 */
export function getSmartCategorySuggestions(query: string): CategoryInfo[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const tokens = clean.split(/[\s_\-.]+/).filter(Boolean);

  const scored = CATEGORIES.map((cat) => {
    let score = 0;
    const catName = cat.name.toLowerCase();

    if (catName.includes(clean)) score += 10;

    tokens.forEach((token) => {
      if (catName.includes(token)) score += 5;
      cat.keywords.forEach((kw) => {
        if (kw === token) score += 8;
        else if (kw.includes(token) || token.includes(kw)) score += 3;
      });
    });

    return { cat, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.cat);
}

/**
 * Predicts the most likely category for an uploaded file
 */
export function predictCategoryForFile(filename: string, mimeType: string): CategoryName {
  const cleanName = filename.toLowerCase();

  if (
    cleanName.endsWith('.zip') ||
    cleanName.endsWith('.apk') ||
    cleanName.includes('game')
  ) {
    return 'Porn Games';
  }

  if (cleanName.includes('ad') || cleanName.includes('promo') || cleanName.includes('sponsor')) {
    return 'Porn Videos';
  }

  for (const cat of CATEGORIES) {
    if (cat.name === 'All') continue;
    for (const kw of cat.keywords) {
      if (cleanName.includes(kw)) {
        return cat.name;
      }
    }
  }

  if (mimeType.startsWith('image/')) {
    return 'Porn Images';
  }
  if (mimeType.startsWith('video/')) {
    return 'Porn Movies';
  }

  return 'All';
}
