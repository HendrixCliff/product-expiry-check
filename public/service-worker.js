self.addEventListener('push', (event) => {
  console.log('[SW] Push event received ✅');

  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.error('❌ Failed to parse push data:', err);
  }

  const title = data.title || 'Pharmacy Notification';
  const options = {
    body: data.body || 'You have a new medicine reminder!',
    icon: '/icon.png',
    badge: '/icon.png',
    data: data, // Attach payload for click event
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/');
    })
  );
});
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed');
});