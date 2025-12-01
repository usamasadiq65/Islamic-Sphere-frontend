// Prayer Notification Service Worker
// This enables notifications even when the browser is closed

const CACHE_NAME = 'prayer-notifications-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Prayer Notification Service Worker...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Prayer Notification Service Worker...');
  event.waitUntil(clients.claim());
});

// Listen for push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  let data = {
    title: '🕌 Prayer Time',
    body: 'It\'s time for prayer',
    icon: '/images/mosque-icon.svg',
    badge: '/images/prayer-badge.svg',
    tag: 'prayer-notification'
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      console.error('[Service Worker] Error parsing push data:', e);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/images/mosque-icon.svg',
    badge: data.badge || '/images/prayer-badge.svg',
    tag: data.tag || 'prayer-notification',
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open the app or focus if already open
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url.includes('/prayer') && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/prayer');
        }
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    schedulePrayerNotifications(event.data.prayerTimes, event.data.notifyBeforeMinutes);
  } else if (event.data.type === 'CLEAR_NOTIFICATIONS') {
    clearScheduledNotifications();
  } else if (event.data.type === 'TEST_NOTIFICATION') {
    showTestNotification();
  }
});

// Store scheduled notification timeouts
let scheduledNotifications = [];

// Schedule prayer notifications
function schedulePrayerNotifications(prayerTimes, notifyBeforeMinutes = 5) {
  // Clear existing schedules
  clearScheduledNotifications();

  if (!prayerTimes) return;

  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const prayerEmojis = {
    Fajr: '🌅',
    Dhuhr: '☀️',
    Asr: '🌤️',
    Maghrib: '🌅',
    Isha: '🌙'
  };

  prayers.forEach(prayerName => {
    const prayerTime = prayerTimes[prayerName];
    if (!prayerTime) return;

    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerTotalMinutes = hours * 60 + minutes;

    // Schedule notification X minutes before
    const beforeTotalMinutes = prayerTotalMinutes - notifyBeforeMinutes;
    if (beforeTotalMinutes > currentTotalMinutes) {
      const msUntilBefore = (beforeTotalMinutes - currentTotalMinutes) * 60 * 1000;
      const beforeTimeout = setTimeout(() => {
        showPrayerNotification(prayerName, 'upcoming', prayerTime, prayerEmojis[prayerName], notifyBeforeMinutes);
      }, msUntilBefore);
      scheduledNotifications.push(beforeTimeout);
    }

    // Schedule notification at exact prayer time
    if (prayerTotalMinutes > currentTotalMinutes) {
      const msUntilPrayer = (prayerTotalMinutes - currentTotalMinutes) * 60 * 1000;
      const exactTimeout = setTimeout(() => {
        showPrayerNotification(prayerName, 'now', prayerTime, prayerEmojis[prayerName], notifyBeforeMinutes);
      }, msUntilPrayer);
      scheduledNotifications.push(exactTimeout);
    }
  });

  console.log(`[Service Worker] Scheduled ${scheduledNotifications.length} notifications`);
}

// Clear all scheduled notifications
function clearScheduledNotifications() {
  scheduledNotifications.forEach(timeoutId => clearTimeout(timeoutId));
  scheduledNotifications = [];
  console.log('[Service Worker] Cleared all scheduled notifications');
}

// Show prayer notification
function showPrayerNotification(prayerName, type, prayerTime, emoji, notifyBeforeMinutes) {
  const formattedTime = formatTime(prayerTime);
  
  let title, body;
  
  if (type === 'now') {
    title = `${emoji} ${prayerName} Prayer Time`;
    body = `It's time for ${prayerName} prayer (${formattedTime})`;
  } else {
    title = `${emoji} ${prayerName} Coming Up`;
    body = `${prayerName} prayer in ${notifyBeforeMinutes} minutes (${formattedTime})`;
  }

  const options = {
    body: body,
    icon: '/images/mosque-icon.svg',
    badge: '/images/prayer-badge.svg',
    tag: `prayer-${prayerName}-${type}`,
    requireInteraction: type === 'now',
    vibrate: [200, 100, 200],
    data: {
      prayerName,
      prayerTime,
      type
    },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  self.registration.showNotification(title, options);
}

// Show test notification
function showTestNotification() {
  self.registration.showNotification('🕌 Prayer Notifications Enabled', {
    body: 'You will now receive prayer time notifications even when the browser is closed.',
    icon: '/images/mosque-icon.svg',
    badge: '/images/prayer-badge.svg',
    tag: 'test-notification',
    requireInteraction: false
  });
}

// Format time to 12-hour format
function formatTime(time24) {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}
