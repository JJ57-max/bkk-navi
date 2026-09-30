// public/sw.js

const CACHE_NAME = 'bkk-nav-cache-v3';

const STATIC_ASSETS = [
  '/manifest.json',
];

// インストール時に最低限の静的ファイルだけキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

// 新しいService Workerをすぐに有効化
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }

            return undefined;
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// リクエスト処理
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // GET以外はService Workerで処理しない
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 外部サイト・外部APIはService Workerで処理しない
  if (url.origin !== self.location.origin) {
    return;
  }

  // APIレスポンスは絶対にキャッシュしない
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // ページナビゲーションはNetwork First
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        return new Response('Network unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });
      })
    );

    return;
  }

  // 同一オリジンのGETリクエストはNetwork First。
  // ネットワーク障害時、キャッシュが存在する場合のみキャッシュを使用する。
  event.respondWith(
    fetch(request).catch(async () => {
      const cachedResponse = await caches.match(request);

      if (cachedResponse) {
        return cachedResponse;
      }

      return new Response('', {
        status: 503,
        statusText: 'Service Unavailable',
      });
    })
  );
});