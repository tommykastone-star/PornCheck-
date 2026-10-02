import { MediaFile } from '../types';

const DB_NAME = 'porncheck_db';
const DB_VERSION = 2; // Incremented for new properties (mode, price, comments, gameData, isPornAd)
const STORE_NAME = 'media_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      let store: IDBObjectStore;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      } else {
        store = (event.target as IDBOpenDBRequest).transaction!.objectStore(STORE_NAME);
      }
      if (!store.indexNames.contains('category')) {
        store.createIndex('category', 'category', { unique: false });
      }
      if (!store.indexNames.contains('addedAt')) {
        store.createIndex('addedAt', 'addedAt', { unique: false });
      }
      if (!store.indexNames.contains('mode')) {
        store.createIndex('mode', 'mode', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaFileToDB(file: MediaFile): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const itemToSave = {
        id: file.id,
        name: file.name,
        type: file.type,
        category: file.category,
        size: file.size,
        addedAt: file.addedAt,
        mode: file.mode || 'manual',
        dataUrl: file.dataUrl,
        blob: file.blob,
        isFavorite: file.isFavorite || false,
        tags: file.tags || [],
        price: file.price,
        isPornAd: file.isPornAd || false,
        gameData: file.gameData,
        comments: file.comments || [],
        uploaderEmail: file.uploaderEmail,
        uploaderName: file.uploaderName,
        uploaderAvatar: file.uploaderAvatar,
        isLiveStream: file.isLiveStream || false,
        liveViewerCount: file.liveViewerCount,
      };
      const req = store.put(itemToSave);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to persist in IndexedDB:', err);
  }
}

export async function loadAllMediaFilesFromDB(): Promise<MediaFile[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result as MediaFile[];
        const hydrated = results.map((item) => {
          let url = item.dataUrl;
          if (item.blob && !url) {
            url = URL.createObjectURL(item.blob);
          }
          return {
            ...item,
            mode: item.mode || 'manual',
            comments: item.comments || [],
            url: url || item.dataUrl,
          };
        });
        resolve(hydrated);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to load from IndexedDB:', err);
    return [];
  }
}

export async function deleteMediaFileFromDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete from IndexedDB:', err);
  }
}

export async function clearAllMediaFilesFromDB(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to clear IndexedDB:', err);
  }
}

export async function clearCategoryFilesFromDB(categoryName: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const all = req.result as MediaFile[];
        all
          .filter((f) => f.category === categoryName)
          .forEach((f) => {
            store.delete(f.id);
          });
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to clear category files from IndexedDB:', err);
  }
}
