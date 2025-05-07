'use client';
import { initializeApp } from 'firebase/app';
import { getMessaging, Messaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
	apiKey: 'AIzaSyD8wChib383Zw6oRNuDJeKAReEYCHuDncM',
	authDomain: 'htx-trade.firebaseapp.com',
	projectId: 'htx-trade',
	storageBucket: 'htx-trade.appspot.com', // ✅ ঠিক করা হয়েছে
	messagingSenderId: '1017443057427',
	appId: '1:1017443057427:web:190a1b640735e279d3a4e6',
};

const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
	messaging = getMessaging(app);
}

export const requestForToken = async (): Promise<string | null> => {
	if (!messaging || !('serviceWorker' in navigator)) return null;

	try {
		const registration = await navigator.serviceWorker.register(
			'/firebase-messaging-sw.js'
		);
		console.log('✅ Service Worker registered:', registration);

		const token = await getToken(messaging, {
			vapidKey:
				'BPuwPIO6Vw62UGNovLW_g9qMUvDDDChEN0W8QjIhcekvcZG_4dRXpHc8G-ckFKO6fu3M6mlv9cGL2CnsV-wxRNc',
			serviceWorkerRegistration: registration,
		});

		if (token) {
			console.log('✅ FCM Token:', token);
			return token;
		} else {
			console.warn('⚠️ No FCM token available');
			return null;
		}
	} catch (err) {
		console.error('❌ Error getting FCM token:', err);
		return null;
	}
};

export { app, messaging };
