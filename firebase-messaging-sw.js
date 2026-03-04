// ═══════════════════════════════════════════════════════════
//  firebase-messaging-sw.js — Protocolo 6AM
//  GitHub Pages: /Protocolo6am/firebase-messaging-sw.js
// ═══════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const CACHE = 'p6am-v4';
const CACHE_URLS = [
  '/Protocolo6am/',
  '/Protocolo6am/index.html',
  '/Protocolo6am/icon-192.png',
  '/Protocolo6am/icon-512.png',
  '/Protocolo6am/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CACHE_URLS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); return res; })
      .catch(() => caches.match(e.request) || caches.match('/Protocolo6am/'))
  );
});

firebase.initializeApp({
  apiKey: "AIzaSyBsPukCvvNFIzg8ytqmaeQTKNnix437gCQ",
  authDomain: "protocolo-6am.firebaseapp.com",
  projectId: "protocolo-6am",
  storageBucket: "protocolo-6am.firebasestorage.app",
  messagingSenderId: "652312227391",
  appId: "1:652312227391:web:2e53e2be0eb6487b16d28a"
});

const messaging = firebase.messaging();

// Push em background via FCM
messaging.onBackgroundMessage(payload => {
  const n = payload.notification || {};
  return self.registration.showNotification(n.title || 'Protocolo 6AM', {
    body:    n.body || '',
    icon:    '/Protocolo6am/icon-192.png',
    badge:   '/Protocolo6am/icon-192.png',
    tag:     payload.data?.taskId || 'p6am',
    data:    { ...payload.data, url: 'https://br-crisferr.github.io/Protocolo6am/' },
    vibrate: [200, 100, 200],
  });
});

// Alarme local — o app envia mensagem para o SW mostrar a notificação
// Isso funciona mesmo com o app em segundo plano
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SHOW_NOTIF') {
    const { title, body, taskId } = e.data;
    self.registration.showNotification(title, {
      body,
      icon:    '/Protocolo6am/icon-192.png',
      badge:   '/Protocolo6am/icon-192.png',
      tag:     `task-${taskId}`,
      vibrate: [200, 100, 200],
      data:    { taskId, url: 'https://br-crisferr.github.io/Protocolo6am/' }
    });
  }
});

// Clique na notificacao
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || 'https://br-crisferr.github.io/Protocolo6am/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      const w = cs.find(c => c.url.includes('Protocolo6am'));
      if (w) { w.focus(); return; }
      return clients.openWindow(url);
    })
  );
});
