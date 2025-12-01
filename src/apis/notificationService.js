// Prayer Notification Service
// Handles browser notifications for prayer times with Service Worker support
// This enables notifications even when the browser is closed

class PrayerNotificationService {
  constructor() {
    this.notificationPermission = 'default';
    this.notifiedPrayers = new Set(); // Track which prayers we've already notified for today
    this.checkInterval = null;
    this.prayerTimes = null;
    this.notificationSound = null;
    this.isEnabled = localStorage.getItem('prayerNotifications') === 'true';
    this.notifyBeforeMinutes = parseInt(localStorage.getItem('notifyBeforeMinutes')) || 5; // Default 5 minutes before
    this.serviceWorkerRegistration = null;
    this.isServiceWorkerSupported = 'serviceWorker' in navigator;
  }

  // Initialize the notification service
  async init() {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    // Request permission
    this.notificationPermission = await this.requestPermission();
    
    // Register service worker for background notifications
    await this.registerServiceWorker();
    
    // Load notification sound
    this.loadNotificationSound();

    // Reset notified prayers at midnight
    this.scheduleMiddnightReset();

    return this.notificationPermission === 'granted';
  }

  // Register Service Worker for background notifications
  async registerServiceWorker() {
    if (!this.isServiceWorkerSupported) {
      console.warn('Service Workers are not supported in this browser');
      return null;
    }

    try {
      // Register the prayer service worker
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw-prayer.js', {
        scope: '/'
      });
      
      console.log('Prayer Service Worker registered successfully:', this.serviceWorkerRegistration);
      
      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('Prayer Service Worker is ready');
      
      return this.serviceWorkerRegistration;
    } catch (error) {
      console.error('Failed to register Prayer Service Worker:', error);
      return null;
    }
  }

  // Get active service worker
  async getServiceWorker() {
    if (!this.isServiceWorkerSupported) return null;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.active;
    } catch (error) {
      console.error('Error getting service worker:', error);
      return null;
    }
  }

  // Send message to service worker
  async sendToServiceWorker(message) {
    const sw = await this.getServiceWorker();
    if (sw) {
      sw.postMessage(message);
      return true;
    }
    return false;
  }

  // Request notification permission
  async requestPermission() {
    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Load notification sound
  loadNotificationSound() {
    try {
      this.notificationSound = new Audio('/sounds/adhan-notification.mp3');
      this.notificationSound.volume = 0.5;
    } catch (error) {
      console.warn('Could not load notification sound:', error);
    }
  }

  // Play notification sound
  playSound() {
    if (this.notificationSound) {
      this.notificationSound.currentTime = 0;
      this.notificationSound.play().catch(err => {
        console.warn('Could not play notification sound:', err);
      });
    }
  }

  // Set prayer times to monitor
  setPrayerTimes(prayerTimes) {
    this.prayerTimes = prayerTimes;
    // Reset notified prayers when new times are set
    this.resetNotifiedPrayers();
    
    // Schedule notifications in service worker for background support
    if (this.isEnabled && this.isServiceWorkerSupported) {
      this.scheduleServiceWorkerNotifications();
    }
  }

  // Schedule notifications through service worker (for background notifications)
  async scheduleServiceWorkerNotifications() {
    if (!this.prayerTimes || !this.isServiceWorkerSupported) return;
    
    const sent = await this.sendToServiceWorker({
      type: 'SCHEDULE_NOTIFICATIONS',
      prayerTimes: this.prayerTimes,
      notifyBeforeMinutes: this.notifyBeforeMinutes
    });
    
    if (sent) {
      console.log('Prayer notifications scheduled in Service Worker');
    }
  }

  // Clear service worker notifications
  async clearServiceWorkerNotifications() {
    if (!this.isServiceWorkerSupported) return;
    
    await this.sendToServiceWorker({
      type: 'CLEAR_NOTIFICATIONS'
    });
  }

  // Enable notifications
  async enable() {
    this.isEnabled = true;
    localStorage.setItem('prayerNotifications', 'true');
    this.startChecking();
    
    // Schedule in service worker for background support
    await this.scheduleServiceWorkerNotifications();
    
    // Show confirmation notification
    await this.sendToServiceWorker({ type: 'TEST_NOTIFICATION' });
  }

  // Disable notifications
  async disable() {
    this.isEnabled = false;
    localStorage.setItem('prayerNotifications', 'false');
    this.stopChecking();
    
    // Clear service worker notifications
    await this.clearServiceWorkerNotifications();
  }

  // Toggle notifications
  async toggle() {
    if (this.isEnabled) {
      await this.disable();
    } else {
      await this.enable();
    }
    return this.isEnabled;
  }

  // Set notification timing (minutes before prayer)
  async setNotifyBeforeMinutes(minutes) {
    this.notifyBeforeMinutes = minutes;
    localStorage.setItem('notifyBeforeMinutes', minutes.toString());
    
    // Re-schedule service worker notifications with new timing
    if (this.isEnabled) {
      await this.scheduleServiceWorkerNotifications();
    }
  }

  // Start checking for prayer times
  startChecking() {
    if (!this.isEnabled || this.notificationPermission !== 'granted') {
      return;
    }

    // Clear any existing interval
    this.stopChecking();

    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkPrayerTimes();
    }, 30000);

    // Also check immediately
    this.checkPrayerTimes();
  }

  // Stop checking for prayer times
  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Check if any prayer time is approaching or has arrived
  checkPrayerTimes() {
    if (!this.prayerTimes || !this.isEnabled) return;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    const prayersToNotify = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    prayersToNotify.forEach(prayerName => {
      const prayerTime = this.prayerTimes[prayerName];
      if (!prayerTime) return;

      // Parse prayer time (format: "HH:MM")
      const [hours, minutes] = prayerTime.split(':').map(Number);
      const prayerTotalMinutes = hours * 60 + minutes;

      // Check if we should notify (at exact time or X minutes before)
      const minutesUntilPrayer = prayerTotalMinutes - currentTotalMinutes;

      // Notification key for tracking
      const notificationKey = `${prayerName}-${now.toDateString()}`;

      // Notify at exact prayer time
      if (minutesUntilPrayer === 0 && !this.notifiedPrayers.has(`${notificationKey}-exact`)) {
        this.showNotification(prayerName, 'now', prayerTime);
        this.notifiedPrayers.add(`${notificationKey}-exact`);
      }
      // Notify X minutes before
      else if (minutesUntilPrayer === this.notifyBeforeMinutes && !this.notifiedPrayers.has(`${notificationKey}-before`)) {
        this.showNotification(prayerName, 'upcoming', prayerTime);
        this.notifiedPrayers.add(`${notificationKey}-before`);
      }
    });
  }

  // Show browser notification
  showNotification(prayerName, type, prayerTime) {
    if (this.notificationPermission !== 'granted') return;

    const prayerEmojis = {
      Fajr: '🌅',
      Dhuhr: '☀️',
      Asr: '🌤️',
      Maghrib: '🌅',
      Isha: '🌙'
    };

    const emoji = prayerEmojis[prayerName] || '🕌';
    
    let title, body;
    
    if (type === 'now') {
      title = `${emoji} ${prayerName} Prayer Time`;
      body = `It's time for ${prayerName} prayer (${this.formatTime(prayerTime)})`;
    } else {
      title = `${emoji} ${prayerName} Coming Up`;
      body = `${prayerName} prayer in ${this.notifyBeforeMinutes} minutes (${this.formatTime(prayerTime)})`;
    }

    const notification = new Notification(title, {
      body: body,
      icon: '/images/mosque-icon.svg',
      badge: '/images/prayer-badge.svg',
      tag: `prayer-${prayerName}`,
      requireInteraction: type === 'now', // Keep notification until user interacts (for exact time)
      vibrate: [200, 100, 200],
      data: {
        prayerName,
        prayerTime,
        type
      }
    });

    // Play sound for exact time notifications
    if (type === 'now') {
      this.playSound();
    }

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 30 seconds for upcoming notifications
    if (type === 'upcoming') {
      setTimeout(() => notification.close(), 30000);
    }
  }

  // Format time for display (12-hour format)
  formatTime(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  // Reset notified prayers (called at midnight)
  resetNotifiedPrayers() {
    this.notifiedPrayers.clear();
  }

  // Schedule midnight reset
  scheduleMiddnightReset() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    
    const timeUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      this.resetNotifiedPrayers();
      // Schedule next day's reset
      this.scheduleMiddnightReset();
    }, timeUntilMidnight);
  }

  // Get notification status
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      permission: this.notificationPermission,
      notifyBeforeMinutes: this.notifyBeforeMinutes,
      isSupported: 'Notification' in window
    };
  }

  // Check if notifications are available
  isAvailable() {
    return 'Notification' in window && this.notificationPermission === 'granted';
  }
}

// Create singleton instance
const prayerNotificationService = new PrayerNotificationService();

export default prayerNotificationService;
