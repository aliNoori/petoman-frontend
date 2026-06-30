// Service Worker for PWA
const CACHE_NAME = 'petoman-panel-v1'
const STATIC_CACHE = 'petoman-static-v1'
const DYNAMIC_CACHE = 'petoman-dynamic-v1'

// فایل‌های استاتیک برای کش
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pet.png',
  '/favicon.ico'
]

// نصب Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
      .catch(err => console.log('Cache error:', err))
  )
})

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated')

  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => {
              console.log('🗑️ Deleting old cache:', key)
              return caches.delete(key)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// بررسی URL قابل کش
function isCacheable(url) {
  // فقط http و https کش بشن
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false
  }
  // chrome-extension و سایر scheme ها کش نشن
  if (url.includes('chrome-extension://') || url.includes('moz-extension://')) {
    return false
  }
  return true
}

// دریافت درخواست‌ها
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = request.url

  // فقط درخواست‌های GET رو کش کن
  if (request.method !== 'GET') return

  // URL های غیر قابل کش رو رد کن
  if (!isCacheable(url)) return

  const urlObj = new URL(url)

  // API calls - Network First
  if (urlObj.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets - Cache First
  if (STATIC_ASSETS.includes(urlObj.pathname) ||
      urlObj.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2?|ttf|eot)$/)) {
    event.respondWith(cacheFirst(request))
    return
  }

  // HTML pages - Network First
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Default - Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request))
})

// Cache First Strategy
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request)
    if (cached) return cached

    const response = await fetch(request)
    if (response.ok && isCacheable(request.url)) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (e) {
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response('Offline', { status: 503 })
  }
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok && isCacheable(request.url)) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (e) {
    const cached = await caches.match(request)
    if (cached) return cached

    // برگشت به صفحه آفلاین
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/') || new Response('Offline', { status: 503 })
    }

    return new Response('Offline', { status: 503 })
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok && isCacheable(request.url)) {
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, response.clone())
        })
      }
      return response.clone()
    })
    .catch(() => null)

  return cached || await fetchPromise || new Response('Offline', { status: 503 })
}

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received')

  let data = { title: 'پت‌اومن', body: 'پیام جدید' }

  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'view', title: 'مشاهده' },
      { action: 'close', title: 'بستن' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification Click
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked')

  event.notification.close()

  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/'

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
          // اگر پنجره‌ای باز هست، فوکوس کن
          for (const client of windowClients) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.focus()
              client.navigate(urlToOpen)
              return
            }
          }
          // در غیر این صورت پنجره جدید باز کن
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  }
})

// Background Sync
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag)

  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders())
  }
})

async function syncOrders() {
  // در اینجا می‌تونید سفارشات آفلاین رو sync کنید
  console.log('📤 Syncing offline orders...')
}
