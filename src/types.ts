export type CategoryName =
  | 'All'
  | 'Porn Shorts'
  | 'Porn Movies'
  | 'Porn Images'
  | 'Porn Games'
  | 'Back Shots'
  | 'Porn Videos'
  | 'Oral Sex'
  | 'Anal Sex'
  | 'Pussy Sex'
  | 'Gays'
  | 'Lesbian'
  | 'Dolls Sex'
  | 'Toys Sex'
  | 'Animation Sex';

export type BrowseMode = 'manual' | 'ai';

export interface CommentItem {
  id: string;
  userName: string;
  userEmail: string;
  text: string;
  createdAt: number;
}

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  category: CategoryName;
  size: number;
  addedAt: number;
  mode: BrowseMode; // 'manual' for human/traditional content, 'ai' for AI-generated contents
  dataUrl?: string;
  blob?: Blob;
  url?: string;
  isFavorite?: boolean;
  tags?: string[];
  duration?: number; // Video duration in seconds (strictly < 180s for Porn Shorts)
  price?: number; // Price set by logged in users for porn movies (or content)
  isPornAd?: boolean; // For Porn Videos ads
  isLiveStream?: boolean; // Real-time user broadcast stream
  liveViewerCount?: number; // Real-time viewers in the room
  gameData?: {
    platform?: string;
    version?: string;
    instructions?: string;
  };
  comments?: CommentItem[];
  uploaderEmail?: string;
  uploaderName?: string;
  uploaderAvatar?: string; // Logged in user face photo / avatar
}

export type AppScreen = 'welcome' | 'gate' | 'home' | 'folder' | 'leave';

export interface UserAccount {
  email: string;
  name?: string;
  avatar?: string; // User profile face photo or uploaded face image
  createdAt: number;
}
