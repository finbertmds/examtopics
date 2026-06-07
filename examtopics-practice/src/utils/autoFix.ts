import { forceCleanupLegacyCache } from './legacyCacheCleanup';

export const autoFixReloadLoop = {
  isInReloadLoop(): boolean {
    const reloadCount = parseInt(sessionStorage.getItem('reloadCount') || '0');
    const lastReloadTime = parseInt(sessionStorage.getItem('lastReloadTime') || '0');
    const now = Date.now();

    return reloadCount >= 2 && (now - lastReloadTime) < 5000;
  },

  updateReloadCounter(): void {
    const reloadCount = parseInt(sessionStorage.getItem('reloadCount') || '0');
    const now = Date.now();

    sessionStorage.setItem('reloadCount', (reloadCount + 1).toString());
    sessionStorage.setItem('lastReloadTime', now.toString());

    setTimeout(() => {
      sessionStorage.removeItem('reloadCount');
      sessionStorage.removeItem('lastReloadTime');
    }, 10000);
  },

  async clearAll(): Promise<void> {
    try {
      console.log('Auto-fixing reload loop...');
      await forceCleanupLegacyCache();
      console.log('Auto-fix completed');
    } catch (error) {
      console.error('Error in auto-fix:', error);
    }
  },

  notifyAndReload(): void {
    window.location.reload();
  },
};
