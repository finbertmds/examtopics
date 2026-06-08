const CLEANUP_FLAG = 'examtopics_cache_cleanup_v1';
const INDEXED_DB_NAME = 'ExamTopicsCache';

const LEGACY_LOCAL_STORAGE_KEYS = ['exam-progress'];

const isLegacyLocalStorageKey = (key: string): boolean => {
  if (LEGACY_LOCAL_STORAGE_KEYS.includes(key)) return true;
  if (key.includes('_history')) return true;
  if (key.startsWith('examtopics') && key !== CLEANUP_FLAG) return true;
  if (key.includes('staticFiles')) return true;
  return false;
};

const deleteIndexedDb = (dbName: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!('indexedDB' in window)) {
      resolve();
      return;
    }

    try {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn(`Failed to delete IndexedDB database: ${dbName}`);
        resolve();
      };
      request.onblocked = () => {
        console.warn(`IndexedDB delete blocked for database: ${dbName}`);
        resolve();
      };
    } catch (error) {
      console.warn(`Error deleting IndexedDB database ${dbName}:`, error);
      resolve();
    }
  });
};

const unregisterAllServiceWorkers = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  } catch (error) {
    console.warn('Failed to unregister service workers:', error);
  }
};

const deleteAppCaches = async (): Promise<void> => {
  if (!('caches' in window)) return;

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith('examtopics'))
        .map((name) => caches.delete(name))
    );
  } catch (error) {
    console.warn('Failed to delete app caches:', error);
  }
};

const removeLegacyLocalStorageKeys = (): void => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (isLegacyLocalStorageKey(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to remove legacy localStorage keys:', error);
  }
};

const removeLegacySessionStorageKeys = (): void => {
  try {
    sessionStorage.removeItem('skipServiceWorker');
    sessionStorage.removeItem('reloadCount');
    sessionStorage.removeItem('lastReloadTime');
  } catch (error) {
    console.warn('Failed to remove legacy sessionStorage keys:', error);
  }
};

export async function cleanupLegacyCache(): Promise<void> {
  if (localStorage.getItem(CLEANUP_FLAG) === 'done') return;

  await Promise.allSettled([
    deleteIndexedDb(INDEXED_DB_NAME),
    unregisterAllServiceWorkers(),
    deleteAppCaches(),
    Promise.resolve().then(removeLegacyLocalStorageKeys),
    Promise.resolve().then(removeLegacySessionStorageKeys),
  ]);

  localStorage.setItem(CLEANUP_FLAG, 'done');
}

export async function forceCleanupLegacyCache(): Promise<void> {
  localStorage.removeItem(CLEANUP_FLAG);
  await cleanupLegacyCache();
}
