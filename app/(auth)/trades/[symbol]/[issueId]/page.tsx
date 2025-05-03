'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useGetSignalTradeDataBySymbolAndIssueIdQuery } from '@/redux/features/trade/tradeApi';
import TradeRoundDetails from '@/components/Trades/TradeRoundDetails';
import AdminResultPanel from '@/components/Trades/AdminResultPanel';
import { useSocket } from '@/context/SocketContext';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';

const TradeDetailsPage = () => {
	const router = useRouter();
	const { socket } = useSocket();
	const { symbol, issueId } = useParams() as {
		symbol: string;
		issueId: string;
	};

	const { data, isLoading, refetch } =
		useGetSignalTradeDataBySymbolAndIssueIdQuery({
			symbol,
			issueId,
		});

	const { round } = data || {};

	useEffect(() => {
		if (!socket || !round) return;

		const roundUpdatedHandler = (payload: any) => {
			const shouldRefetch =
				payload.symbol === round.symbol && payload.issueId === round.issueId;

			if (shouldRefetch) {
				console.log('🔁 Refetching round data due to socket update...');
				refetch();
			}
		};

		const handleSettlementRounds = (updatedRounds: any[]) => {
			const matched = updatedRounds.some(
				(r) => r.symbol === round.symbol && r.issueId === round.issueId
			);
			if (matched) {
				console.log('🟢 Refetch due to round settlement...');
				refetch();
			}
		};

		socket.on('trade-placed', roundUpdatedHandler);
		socket.on('trade-round-updated', roundUpdatedHandler);
		socket.on('settle-rounds', handleSettlementRounds);

		return () => {
			socket.off('trade-placed', roundUpdatedHandler);
			socket.off('trade-round-updated', roundUpdatedHandler);
			socket.off('settle-rounds', handleSettlementRounds);
		};
	}, [socket, round, refetch]);

	if (isLoading) return <p className='p-4'>Loading...</p>;
	if (!round) return <p className='p-4'>Round not found.</p>;

	return (
		<div className='w-full mx-auto'>
			<div>
				<button
					type='button'
					onClick={() => router.back()}
					className='flex items-center  text-gray-700 hover:text-blue-600'
				>
					<MdKeyboardDoubleArrowLeft className='' />
					<span className=''>Back</span>
				</button>
			</div>
			<h1 className='text-xl font-bold mb-4'>🔍 Trade Round Details</h1>
			<TradeRoundDetails round={round} />

			{round?.is_active ? (
				<div className='mt-6'>
					<AdminResultPanel round={round} />
				</div>
			) : (
				<div className='mt-6'>
					<h2 className='text-lg font-semibold mb-4'>🧠 Round Result</h2>
					<div className='p-4 border rounded bg-gray-50 shadow-md flex items-center gap-4 '>
						<button
							type='button'
							onClick={() => router.back()}
							className='flex items-center  text-gray-700 hover:text-blue-600'
						>
							<MdKeyboardDoubleArrowLeft className='' />
							<span className=''>Back</span>
						</button>
						<p className='text-gray-700'>
							<span className='font-semibold'>Result:</span>{' '}
							{round?.result || 'Not declared yet'}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default TradeDetailsPage;
