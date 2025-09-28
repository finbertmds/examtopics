/**
 * Network Service - Handles network detection, connectivity monitoring, and sync management
 * Provides real-time network status and automatic synchronization capabilities
 */
class NetworkService {
  private isOnline: boolean = navigator.onLine;
  private listeners: Array<(isOnline: boolean) => void> = [];
  private syncInterval: NodeJS.Timeout | null = null;
  private lastSyncTime: number = 0;
  private syncDelay: number = 5000; // 5 seconds delay between sync attempts

  constructor() {
    this.setupEventListeners();
  }

  init() {
    console.log('Network service initialized');
    this.startPeriodicSync();
  }

  private setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Listen for visibility change to sync when tab becomes active
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Listen for focus events to sync when window regains focus
    window.addEventListener('focus', this.handleFocus.bind(this));
  }

  private handleOnline() {
    console.log('Network is online');
    this.isOnline = true;
    this.notifyListeners(true);
    this.triggerSync();
  }

  private handleOffline() {
    console.log('Network is offline');
    this.isOnline = false;
    this.notifyListeners(false);
    this.stopPeriodicSync();
  }

  private handleVisibilityChange() {
    if (!document.hidden && this.isOnline) {
      console.log('Tab became visible, checking for sync');
      this.triggerSync();
    }
  }

  private handleFocus() {
    if (this.isOnline) {
      console.log('Window gained focus, checking for sync');
      this.triggerSync();
    }
  }

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach(listener => {
      try {
        listener(isOnline);
      } catch (error) {
        console.error('Error in network status listener:', error);
      }
    });
  }

  // Public API
  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  addNetworkStatusListener(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Sync management
  private startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Sync every 30 seconds when online
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.triggerSync();
      }
    }, 30000);
  }

  private stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private triggerSync() {
    const now = Date.now();
    if (now - this.lastSyncTime < this.syncDelay) {
      return; // Too soon since last sync
    }

    this.lastSyncTime = now;
    this.performSync();
  }

  private async performSync() {
    try {
      // Import dataService dynamically to avoid circular dependencies
      const { dataService } = await import('./dataService');
      
      if (dataService.getSyncQueueLength() > 0) {
        console.log('Performing background sync...');
        await dataService.forceSync();
        console.log('Background sync completed');
      }
    } catch (error) {
      console.error('Error during background sync:', error);
    }
  }

  // Network quality detection
  async checkNetworkQuality(): Promise<'good' | 'slow' | 'offline'> {
    if (!this.isOnline) {
      return 'offline';
    }

    try {
      const startTime = Date.now();
      
      // Try to fetch a small resource to test network speed
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        if (responseTime < 1000) {
          return 'good';
        } else {
          return 'slow';
        }
      } else {
        return 'offline';
      }
    } catch (error) {
      console.warn('Network quality check failed:', error);
      return 'offline';
    }
  }

  // Connection type detection (if available)
  getConnectionType(): string | null {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || connection?.type || null;
    }
    return null;
  }

  // Bandwidth estimation (if available)
  getBandwidth(): number | null {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.downlink || null;
    }
    return null;
  }

  // Manual sync trigger
  async forceSyncNow(): Promise<boolean> {
    if (!this.isOnline) {
      console.warn('Cannot sync while offline');
      return false;
    }

    try {
      const { dataService } = await import('./dataService');
      await dataService.forceSync();
      this.lastSyncTime = Date.now();
      return true;
    } catch (error) {
      console.error('Manual sync failed:', error);
      return false;
    }
  }

  // Get sync status
  getSyncStatus(): {
    isOnline: boolean;
    lastSyncTime: number;
    connectionType: string | null;
    bandwidth: number | null;
  } {
    return {
      isOnline: this.isOnline,
      lastSyncTime: this.lastSyncTime,
      connectionType: this.getConnectionType(),
      bandwidth: this.getBandwidth()
    };
  }

  // Cleanup
  destroy() {
    this.stopPeriodicSync();
    this.listeners = [];
    
    // Remove event listeners
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('focus', this.handleFocus.bind(this));
  }
}

// Export singleton instance
export const networkService = new NetworkService();
export { NetworkService };
