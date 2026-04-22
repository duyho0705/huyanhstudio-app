// ==============================
// storageService.js - Enterprise Storage Management
// ==============================

const CACHE_PREFIX = "music_booking_";
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Enterprise-grade storage service with TTL support
 * Handles localStorage, sessionStorage, and cache expiration
 */
class StorageService {
  // ========================================
  // CACHE MANAGEMENT (localStorage with TTL)
  // ========================================

  /**
   * Set cache with automatic expiration
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
   */
  static setCache(key, data, ttl = DEFAULT_TTL) {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error("[StorageService] setCache failed:", error);
      // Handle quota exceeded error
      if (error.name === "QuotaExceededError") {
        this.clearExpiredCache();
      }
    }
  }

  /**
   * Get cache if not expired
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if expired/not found
   */
  static getCache(key) {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;

      const item = JSON.parse(raw);
      const isExpired = Date.now() - item.timestamp > item.ttl;

      if (isExpired) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error("[StorageService] getCache failed:", error);
      return null;
    }
  }

  /**
   * Remove specific cache
   * @param {string} key - Cache key to remove
   */
  static removeCache(key) {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error("[StorageService] removeCache failed:", error);
    }
  }

  /**
   * Clear all expired cache entries
   * @returns {number} Number of expired items cleared
   */
  static clearExpiredCache() {
    try {
      const keys = Object.keys(localStorage);
      let clearedCount = 0;

      keys.forEach((key) => {
        if (!key.startsWith(CACHE_PREFIX)) return;

        const raw = localStorage.getItem(key);
        if (!raw) return;

        try {
          const item = JSON.parse(raw);
          if (item.ttl && Date.now() - item.timestamp > item.ttl) {
            localStorage.removeItem(key);
            clearedCount++;
          }
        } catch {
          // Invalid JSON, remove it
          localStorage.removeItem(key);
          clearedCount++;
        }
      });

      return clearedCount;
    } catch (error) {
      console.error("[StorageService] clearExpiredCache failed:", error);
      return 0;
    }
  }

  // ========================================
  // USER PREFERENCES (localStorage, no TTL)
  // ========================================

  /**
   * Set user preference (persists indefinitely)
   * @param {string} key - Preference key
   * @param {any} value - Preference value
   */
  static setPreference(key, value) {
    try {
      localStorage.setItem(
        CACHE_PREFIX + "pref_" + key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error("[StorageService] setPreference failed:", error);
    }
  }

  /**
   * Get user preference
   * @param {string} key - Preference key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Preference value or default
   */
  static getPreference(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + "pref_" + key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (error) {
      console.error("[StorageService] getPreference failed:", error);
      return defaultValue;
    }
  }

  /**
   * Remove user preference
   * @param {string} key - Preference key to remove
   */
  static removePreference(key) {
    try {
      localStorage.removeItem(CACHE_PREFIX + "pref_" + key);
    } catch (error) {
      console.error("[StorageService] removePreference failed:", error);
    }
  }

  // ========================================
  // SESSION STORAGE (temporary, clears on tab close)
  // ========================================

  /**
   * Set session data
   * @param {string} key - Session key
   * @param {any} value - Session value
   */
  static setSession(key, value) {
    try {
      sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error("[StorageService] setSession failed:", error);
    }
  }

  /**
   * Get session data
   * @param {string} key - Session key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Session value or default
   */
  static getSession(key, defaultValue = null) {
    try {
      const raw = sessionStorage.getItem(CACHE_PREFIX + key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (error) {
      console.error("[StorageService] getSession failed:", error);
      return defaultValue;
    }
  }

  /**
   * Remove session data
   * @param {string} key - Session key to remove
   */
  static removeSession(key) {
    try {
      sessionStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error("[StorageService] removeSession failed:", error);
    }
  }

  // ========================================
  // LEGACY COMPATIBILITY (for existing code)
  // ========================================

  /**
   * Set user cache (backward compatible)
   * @param {object} userData - User data to cache
   */
  static setUserCache(userData) {
    try {
      localStorage.setItem("user_cache", JSON.stringify(userData));
    } catch (error) {
      console.error("[StorageService] setUserCache failed:", error);
    }
  }

  /**
   * Get user cache (backward compatible)
   * @returns {object|null} Cached user data
   */
  static getUserCache() {
    try {
      const raw = localStorage.getItem("user_cache");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("[StorageService] getUserCache failed:", error);
      return null;
    }
  }

  /**
   * Remove user cache (backward compatible)
   */
  static removeUserCache() {
    try {
      localStorage.removeItem("user_cache");
    } catch (error) {
      console.error("[StorageService] removeUserCache failed:", error);
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Clear all application storage (logout cleanup)
   * @param {boolean} clearEverything - If true, clears ALL localStorage (default: false, only clears app-specific)
   */
  static clearAll(clearEverything = false) {
    try {
      if (clearEverything) {
        // Nuclear option: clear everything
        localStorage.clear();
        sessionStorage.clear();
      } else {
        // Clear only app-specific localStorage items
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith(CACHE_PREFIX) || key === "user_cache") {
            localStorage.removeItem(key);
          }
        });

        // Clear all sessionStorage
        sessionStorage.clear();
        console.log("[StorageService] Cleared app-specific storage");
      }
    } catch (error) {
      console.error("[StorageService] clearAll failed:", error);
    }
  }

  /**
   * Clear all booking caches
   */
  static clearBookingCache() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("bookings_")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("[StorageService] clearBookingCache failed:", error);
    }
  }

  /**
   * Get storage size info (for debugging)
   * @returns {object} Storage size information
   */
  static getStorageInfo() {
    try {
      let totalSize = 0;
      let itemCount = 0;

      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        const value = localStorage.getItem(key);
        totalSize += key.length + (value?.length || 0);
        itemCount++;
      });

      return {
        itemCount,
        totalSize,
        totalSizeKB: (totalSize / 1024).toFixed(2),
        estimatedLimit: "5-10 MB",
      };
    } catch (error) {
      console.error("[StorageService] getStorageInfo failed:", error);
      return null;
    }
  }
}

export default StorageService;
