// Нуқсон илова — офлайн иш учун. Илова файллари телефонда сақланади,
// ҳар очилганда фонда янгиланади (кейинги очилишда янги версия).
const C = 'nuqson-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './config.js', './icon-192.png', './icon-512.png', './icon-maskable.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // сервер сўровларига тегмаймиз
  const key = u.origin + u.pathname;
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(key);
    const net = fetch(e.request).then(r => { if (r.ok) c.put(key, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
