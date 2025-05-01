'use client';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

const firebaseConfig = {
	apiKey: 'AIzaSyCIQbXC3ORKg2KNEWcWlTzFc0iyRtpBzmE',
	authDomain: 'icm-money.firebaseapp.com',
	projectId: 'icm-money',
	storageBucket: 'icm-money.firebasestorage.app',
	messagingSenderId: '312980121205',
	appId: '1:312980121205:web:3431e15f4bffb40e223a3c',
	measurementId: 'G-DN8X6K6554',
};

// ✅ Firebase App Initialize
const app = initializeApp(firebaseConfig);

// ✅ Messaging শুধু তখনই লোড হবে যখন **window** অবজেক্ট থাকবে (Client-Side)
let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
	messaging = getMessaging(app);
}

// ✅ Service Worker রেজিস্টার করার ফাংশন (Client-Side Only)
export const registerServiceWorker = async () => {
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register(
				'/firebase-messaging-sw.js'
			);
			console.log('Service Worker registered successfully:', registration);
		} catch (error) {
			console.error('Service Worker registration failed:', error);
		}
	}
};

// ✅ Push Notification Token নেওয়ার ফাংশন (Client-Side Only)
export const requestForToken = async (): Promise<string | null> => {
	if (!messaging) {
		console.warn('Messaging is not available on the server side.');
		return null;
	}

	try {
		await registerServiceWorker();
		const token = await getToken(messaging, {
			vapidKey:
				'BLW8YC9KAKzuPDYzAQyFVfOLN8SkYTbYyWj3b6ekzj_UH8OPZAc1glMIj2QpsQJi9G39PDGnBrgwopXoqYmwbDk',
		});

		if (token) {
			console.log('FCM Token:', token);
			return token;
		} else {
			console.warn('No FCM token available.');
			return null;
		}
	} catch (error) {
		console.error('Error getting token:', error);
		return null;
	}
};

// ✅ Export Firebase App & Messaging (Messaging will be null on server)
export { app, messaging };
