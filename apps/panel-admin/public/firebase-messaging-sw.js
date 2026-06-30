// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// تنظیمات پروژه فایربیس خود را اینجا وارد کنید
firebase.initializeApp({
    apiKey: "AIzaSyCfOfrWJhj7ZnfroIb6jRs5XBcwwUminIM",
    authDomain: "firbaseprojectpetoman.firebaseapp.com",
    projectId: "firbaseprojectpetoman",
    storageBucket: "firbaseprojectpetoman.firebasestorage.app",
    messagingSenderId: "646062800359",
    appId: "1:646062800359:web:954ff45bd15ab8b990d142",
    measurementId: "G-GC5ZS59NDF"
});

const messaging = firebase.messaging();

// فقط وقتی پیامی بیاید که فقط data داشته باشد (نه notification)
messaging.onBackgroundMessage((payload) => {
    // console.log('[firebase-messaging-sw.js] Received background message', payload);

    // استخراج داده‌ها
    const title = payload.data?.title || "پیام جدید";
    const body = payload.data?.body || "";
    const deepLink = payload.data?.deep_link || "http://localhost:5173";

    const notificationOptions = {
        body: body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        actions: [
            { action: 'view', title: 'مشاهده' },
            { action: 'close', title: 'بستن' }
        ],
        data: {
            url: deepLink // ذخیره لینک برای استفاده در کلیک
        },
        tag: 'petoman-tag' // یک تگ یکتا برای جلوگیری از تکرار
    };

    self.registration.showNotification(title, notificationOptions);
});

// ۲. مدیریت کلیک روی دکمه‌ها
self.addEventListener('notificationclick', function(event) {
    // console.log('Notification action clicked:', event.action);

    // بستن نوتیفیکیشن
    event.notification.close();

    if (event.action === 'close') {
        // اگر دکمه بسته شدن کلیک شد، کاری نکن
        console.log('User closed notification');
        return;
    }

    // اگر دکمه مشاهده کلیک شد (یا کلیک معمولی روی خود نوتیفیکیشن)
    const urlToOpen = event.notification.data?.url || "http://localhost:5173";

    event.waitUntil(
        clients.matchAll({ type: "window" }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.includes(urlToOpen.split('//')[1]) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
