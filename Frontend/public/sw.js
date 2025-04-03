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

    // If the user already has a tab open, it focuses the existing one instead of opening a new one.
    if (event.action === 'open' && event.notification.data.url) {
        event.waitUntil(clients.openWindow(event.notification.data.url));
    } else {
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((clientList) => {
                if (clientList.length > 0) {
                    clientList[0].focus();
                } else {
                    clients.openWindow(event.notification.data.url || '/');
                }
            })
        );
    }
});

self.addEventListener('pushsubscriptionchange', async (event) => {
    console.log('Push Subscription expired or changed');
});