/**
 * Version Manager for PWA cache control
 * Handles automatic update checks and force updates
 */

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const LAST_CHECK_KEY = 'fff_last_version_check';
const CURRENT_VERSION_KEY = 'fff_current_version';

interface VersionInfo {
  version: string;
  buildTime: string;
  hasUpdate: boolean;
}

export class VersionManager {
  private static lastCheckTime: number = 0;

  /**
   * Get the current build version from the build timestamp
   */
  static async getCurrentBuildVersion(): Promise<string> {
    try {
      // Try to fetch the build manifest or index.html to get version info
      const response = await fetch('/index.html', { cache: 'no-store' });
      const html = await response.text();
      
      // Extract version from meta tag or use hash of content
      const versionMatch = html.match(/data-version="([^"]+)"/);
      if (versionMatch) {
        return versionMatch[1];
      }
      
      // Fallback: use hash of the HTML content
      const hash = await this.hashContent(html);
      return hash.substring(0, 12);
    } catch (error) {
      console.error('[VersionManager] Failed to get build version:', error);
      return 'unknown';
    }
  }

  /**
   * Check if there's a new version available
   */
  static async checkForUpdates(forceCheck: boolean = false): Promise<VersionInfo> {
    const now = Date.now();
    const lastCheck = parseInt(localStorage.getItem(LAST_CHECK_KEY) || '0', 10);
    
    // Skip check if we checked recently (unless forced)
    if (!forceCheck && now - lastCheck < VERSION_CHECK_INTERVAL) {
      return {
        version: localStorage.getItem(CURRENT_VERSION_KEY) || 'unknown',
        buildTime: new Date(lastCheck).toISOString(),
        hasUpdate: false,
      };
    }

    try {
      const currentVersion = await this.getCurrentBuildVersion();
      const storedVersion = localStorage.getItem(CURRENT_VERSION_KEY);
      
      localStorage.setItem(LAST_CHECK_KEY, now.toString());
      localStorage.setItem(CURRENT_VERSION_KEY, currentVersion);
      
      const hasUpdate = storedVersion !== null && storedVersion !== currentVersion;
      
      if (hasUpdate) {
        console.log('[VersionManager] Update available:', storedVersion, '->', currentVersion);
      }
      
      return {
        version: currentVersion,
        buildTime: new Date().toISOString(),
        hasUpdate,
      };
    } catch (error) {
      console.error('[VersionManager] Update check failed:', error);
      return {
        version: 'unknown',
        buildTime: new Date().toISOString(),
        hasUpdate: false,
      };
    }
  }

  /**
   * Force update by clearing caches and reloading
   */
  static async forceUpdate(): Promise<void> {
    console.log('[VersionManager] Force updating...');
    
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('[VersionManager] Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => {
            console.log('[VersionManager] Unregistering service worker');
            return registration.unregister();
          })
        );
      }

      // Clear version info
      localStorage.removeItem(LAST_CHECK_KEY);
      localStorage.removeItem(CURRENT_VERSION_KEY);

      // Hard reload
      window.location.reload();
    } catch (error) {
      console.error('[VersionManager] Force update failed:', error);
      // Fallback to simple reload
      window.location.reload();
    }
  }

  /**
   * Initialize version manager and optionally check for updates
   */
  static async initialize(forceCheck: boolean = false): Promise<VersionInfo> {
    console.log('[VersionManager] Initializing...');
    
    const versionInfo = await this.checkForUpdates(forceCheck);
    
    if (versionInfo.hasUpdate) {
      console.log('[VersionManager] New version available, consider refreshing');
      // Could show a toast or notification here
    }
    
    return versionInfo;
  }

  /**
   * Create a simple hash of content for version comparison
   */
  private static async hashContent(content: string): Promise<string> {
    if ('crypto' in window && 'subtle' in crypto) {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback simple hash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}