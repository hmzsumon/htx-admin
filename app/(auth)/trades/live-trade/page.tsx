'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import CreateLiveTradeFrom from '@/components/Trades/CreateLiveTradeFrom';
import { useSocket } from '@/context/SocketContext';
import { useGetLiveTradeForAdminQuery } from '@/redux/features/trade/tradeApi';
import LiveTradeView from '@/components/Trades/LiveTradeView';

const LiveTradePage = () => {
	const { socket } = useSocket(); // ✅ use socket
	const { data, refetch } = useGetLiveTradeForAdminQuery(undefined); // ✅ refetch function
	const { upcomingLiveTrade } = data || {};

	// ✅ Handle socket event for new user join
	useEffect(() => {
		if (!socket) return;

		socket.on('user-joined-live-trade', (payload) => {
			console.log('📢 New User Joined:', payload);
			toast.info(`New user joined live trade: ${payload?.name || 'Someone'}`);
			refetch(); // ✅ Update UI (re-fetch latest upcoming live trade)
		});

		return () => {
			socket.off('user-joined-live-trade');
		};
	}, [socket, refetch]);
	return (
		<div className='text-gray-800 text-sm font-semibold'>
			<h1>Live Trade Page</h1>

			<div className='flex flex-col gap-4'>
				{/* create live trade */}
				<CreateLiveTradeFrom liveTrade={upcomingLiveTrade} refetch={refetch} />
				{/*end create live trade */}

				{/* Live Trade View */}
				<LiveTradeView liveTrade={upcomingLiveTrade} />
				{/* End Live Trade View */}
			</div>
		</div>
	);
};

export default LiveTradePage;
