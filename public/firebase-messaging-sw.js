importScripts(
	'https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js'
);
importScripts(
	'https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js'
);

firebase.initializeApp({
	apiKey: 'AIzaSyD8wChib383Zw6oRNuDJeKAReEYCHuDncM',
	authDomain: 'htx-trade.firebaseapp.com',
	projectId: 'htx-trade',
	storageBucket: 'htx-trade.appspot.com',
	messagingSenderId: '1017443057427',
	appId: '1:1017443057427:web:190a1b640735e279d3a4e6',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
	console.log(
		'[firebase-messaging-sw.js] Received background message:',
		payload
	);

	const notificationTitle = payload.notification?.title || '🔔 Notification';
	const notificationOptions = {
		body: payload.notification?.body || '',
		icon: '/icon-192x192.png', // 🔁 Ensure this file exists in /public
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();
	event.waitUntil(
		clients.openWindow('https://htx-trade.web.app/') // 🔁 or your dashboard
	);
});
