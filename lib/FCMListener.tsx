'use client';
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging, requestForToken } from '@/lib/firebase';
import { toast } from 'react-toastify';

export const FCMListener = () => {
	useEffect(() => {
		const init = async () => {
			const token = await requestForToken();
			if (token) {
				console.log('✅ Token ready:', token);
				// TODO: Send token to backend here
			}
		};

		init();

		if (!messaging) return;

		const unsubscribe = onMessage(messaging, (payload) => {
			console.log('📩 Foreground message:', payload);
			toast(`${payload.notification?.title}: ${payload.notification?.body}`);
		});

		return () => unsubscribe();
	}, []);

	return null;
};
