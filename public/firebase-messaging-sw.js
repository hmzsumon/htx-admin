'use client';
importScripts(
	'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js'
);
importScripts(
	'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js'
);

// আপনার Firebase কনফিগারেশন যুক্ত করুন
const firebaseConfig = {
	apiKey: 'YOUR_API_KEY',
	authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
	projectId: 'YOUR_PROJECT_ID',
	storageBucket: 'YOUR_PROJECT_ID.appspot.com',
	messagingSenderId: 'YOUR_SENDER_ID',
	appId: 'YOUR_APP_ID',
};

// Firebase ইনিশিয়ালাইজ করুন
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// ব্যাকগ্রাউন্ড নোটিফিকেশন হ্যান্ডেল করুন
messaging.onBackgroundMessage((payload) => {
	console.log('Background Message received: ', payload);
	self.registration.showNotification(payload.notification.title, {
		body: payload.notification.body,
		icon: '/firebase-logo.png',
	});
});
