'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import baseUrl from '@/config/baseUrl';

const url = `${baseUrl}/api/v1`;

console.log('baseUrl', baseUrl);

// Socket server URL
const SOCKET_URL = baseUrl;

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

// Provider
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		// Connect socket
		const socketIo = io(SOCKET_URL, {
			transports: ['websocket'], // optional, for better stability
		});

		setSocket(socketIo);

		socketIo.on('connect', () => {
			console.log('✅ Admin Socket Connected:', socketIo.id);
			setIsConnected(true);
		});

		socketIo.on('disconnect', () => {
			console.log('❌ Admin Socket Disconnected');
			setIsConnected(false);
		});

		// Clean up socket on unmount
		return () => {
			socketIo.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};

// Custom hook
export const useSocket = () => useContext(SocketContext);
