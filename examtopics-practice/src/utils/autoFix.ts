/**
 * Auto-fix utility for handling reload loops and service worker issues
 */

export const autoFixReloadLoop = {
  // Check if we're in a reload loop
  isInReloadLoop(): boolean {
    const reloadCount = parseInt(sessionStorage.getItem('reloadCount') || '0');
    const lastReloadTime = parseInt(sessionStorage.getItem('lastReloadTime') || '0');
    const now = Date.now();
    
    // More aggressive detection: 2 reloads in 5 seconds
    return reloadCount >= 2 && (now - lastReloadTime) < 5000;
  },

  // Update reload counter
  updateReloadCounter(): void {
    const reloadCount = parseInt(sessionStorage.getItem('reloadCount') || '0');
    const now = Date.now();
    
    sessionStorage.setItem('reloadCount', (reloadCount + 1).toString());
    sessionStorage.setItem('lastReloadTime', now.toString());
    
    // Reset counter after 10 seconds
    setTimeout(() => {
      sessionStorage.removeItem('reloadCount');
      sessionStorage.removeItem('lastReloadTime');
    }, 10000);
  },

  // Clear all problematic caches and service workers
  async clearAll(): Promise<void> {
    try {
      console.log('Auto-fixing reload loop...');
      
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('Service Worker unregistered:', registration);
        }
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        console.log('All caches cleared');
      }
      
      // Mark to skip service worker on next load
      sessionStorage.setItem('skipServiceWorker', 'true');
      
      // Clear session storage (but keep skipServiceWorker flag)
      const skipFlag = sessionStorage.getItem('skipServiceWorker');
      sessionStorage.clear();
      if (skipFlag) {
        sessionStorage.setItem('skipServiceWorker', skipFlag);
      }
      
      console.log('Auto-fix completed');
    } catch (error) {
      console.error('Error in auto-fix:', error);
    }
  },

  // Show user notification and reload
  notifyAndReload(): void {
    console.log('Auto-fixing reload loop...');
    // Don't show alert to avoid blocking
    // alert('Đã phát hiện lỗi reload liên tục và tự động khắc phục. Trang sẽ được tải lại.');
    window.location.reload();
  },

  // Check if service worker should be skipped
  shouldSkipServiceWorker(): boolean {
    return sessionStorage.getItem('skipServiceWorker') === 'true';
  },

  // Reset service worker skip flag (for manual re-enable)
  resetServiceWorkerSkip(): void {
    sessionStorage.removeItem('skipServiceWorker');
  }
};
