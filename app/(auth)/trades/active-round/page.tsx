'use client';

import React, { useEffect, useState } from 'react';
import { useGetTradeRoundsByPeriodQuery } from '@/redux/features/trade/tradeApi';
import TradeRoundTable from '@/components/Trades/TradeRoundTable';
import { useSocket } from '@/context/SocketContext';

const AdminRoundsPage = () => {
	const { socket } = useSocket();
	const timePeriods = ['1m', '3m', '5m', '15m', '30m'];
	const [selectedPeriod, setSelectedPeriod] = useState('3m');

	const { data, isLoading, refetch } =
		useGetTradeRoundsByPeriodQuery(selectedPeriod);
	const tradeRounds = data?.tradeRounds || [];

	// useEffect for socket event
	useEffect(() => {
		if (!socket) return;

		// handler
		const roundUpdatedHandler = (payload: any) => {
			if (payload?.[0].timePeriod === selectedPeriod) {
				refetch(); // refetch the data when the round is updated
			}
		};

		socket.on('new-round', (payload) => {
			roundUpdatedHandler(payload);
		});

		return () => {
			socket.off('new-round');
		};
	}, [socket, refetch]);

	const handlePeriodChange = (period: string) => {
		setSelectedPeriod(period);
		refetch(); // refetch the data when the period changes
	};

	return (
		<div className=''>
			<h1 className='text-2xl font-bold mb-4'>
				📋 Trade Rounds by Time Period
			</h1>

			<div className='flex flex-wrap gap-2 mb-6'>
				{timePeriods.map((period) => (
					<button
						key={period}
						onClick={() => handlePeriodChange(period)}
						className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
							selectedPeriod === period
								? 'bg-blue-600 text-white border-blue-600'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						{period.toUpperCase()}
					</button>
				))}
			</div>
			<TradeRoundTable
				rounds={tradeRounds}
				isLoading={isLoading}
				refetch={refetch}
			/>
		</div>
	);
};

export default AdminRoundsPage;
