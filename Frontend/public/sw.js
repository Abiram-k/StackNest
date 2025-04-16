self.addEventListener('install', (event) => {
    // console.log('Service Worker installing...');
    self.skipWaiting(); //  ensures the new service worker takes control immediately, without waiting for old service workers to stop.
});

self.addEventListener('activate', (event) => {
    // console.log('Service Worker activated');
    return self.clients.claim(); // forces the service worker to immediately control any open client pages, without waiting for a page reload.
});


self.addEventListener('push', (event) => {
    if (!event.data) {
        console.log('Push event but no data');
        return;
    }

    const data = event.data.json();


    const options = {
        body: data.body || 'You have a new notification!',
        icon: data.icon || '/notification-icon.png',
        badge: '/notification-badge.png',
        data: { url: data.url || '/' },
        vibrate: [200, 100, 200],
        actions: [
            { action: 'open', title: 'View' },
            { action: 'close', title: 'Dismiss' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', options) //ensures the operation completes before the service worker stops.
    );

});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const redirectUrl = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(redirectUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(redirectUrl);
            }
        })
    );
});


self.addEventListener('pushsubscriptionchange', async (event) => {
    console.log('Push Subscription expired or changed');
});