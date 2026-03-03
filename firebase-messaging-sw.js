// ═══════════════════════════════════════════════════════════
//  firebase-messaging-sw.js — Protocolo 6AM
//  Coloque na RAIZ do Firebase Hosting: /public/firebase-messaging-sw.js
//  Necessário para push notifications em background (FCM)
// ═══════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBsPukCvvNFIzg8ytqmaeQTKNnix437gCQ",
  authDomain: "protocolo-6am.firebaseapp.com",
  projectId: "protocolo-6am",
  storageBucket: "protocolo-6am.firebasestorage.app",
  messagingSenderId: "652312227391",
  appId: "1:652312227391:web:2e53e2be0eb6487b16d28a"
});

const messaging = firebase.messaging();

// ── Receber push quando o app está em BACKGROUND ou FECHADO ──
messaging.onBackgroundMessage(payload => {
  console.log('[FCM SW] Background message:', payload);

  const n = payload.notification || {};
  const data = payload.data || {};

  const title = n.title || 'Protocolo 6AM';
  const options = {
    body:    n.body || 'Nova notificação do Protocolo.',
    icon:    n.icon || '/icon-192.png',
    badge:   '/icon-192.png',
    tag:     data.taskId || 'p6am-notif',
    data:    data,
    vibrate: [200, 100, 200],
    requireInteraction: false,
    actions: [
      { action: 'open', title: '✅ Ver Tarefa' },
      { action: 'dismiss', title: '✕ Fechar' }
    ]
  };

  return self.registration.showNotification(title, options);
});

// ── Clique na notificação → abre o app ──
self.addEventListener('notificationclick', e => {
  e.notification.close();

  if (e.action === 'dismiss') return;

  const targetUrl = e.notification.data?.url || '/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      // Se já existe uma janela aberta → focar
      const existing = cs.find(c => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        // Enviar mensagem para o app focar na tarefa correta
        if (e.notification.data?.taskId) {
          existing.postMessage({ type: 'NOTIF_CLICK', taskId: e.notification.data.taskId });
        }
        return;
      }
      // Senão → abrir nova janela
      return clients.openWindow(targetUrl);
    })
  );
});

// ── Fechar notificações antigas ao ativar novo SW ──
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
