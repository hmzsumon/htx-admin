'use client';

import React, { useEffect } from 'react';
import { formatBalance, formatTime } from '@/lib/functions';
import { RingLoader } from 'react-spinners';
import { useSocket } from '@/context/SocketContext';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';

interface TradeRoundTableProps {
	rounds: any[];
	isLoading: boolean;
	refetch: () => void;
}

const getRowBg = (symbol: string) => {
	switch (symbol) {
		case 'BTCUSDT':
			return 'bg-red-50';
		case 'ETHUSDT':
			return 'bg-green-50';
		case 'BNBUSDT':
			return 'bg-blue-50';
		case 'SOLUSDT':
			return 'bg-yellow-50';
		case 'TRUMPUSDT':
			return 'bg-purple-50';
		case 'LTCUSDT':
			return 'bg-cyan-50';
		default:
			return 'bg-white';
	}
};

const TradeRoundTable = ({
	rounds = [],
	isLoading,
	refetch,
}: TradeRoundTableProps) => {
	const { socket } = useSocket();

	useEffect(() => {
		if (!socket) return;

		const roundUpdatedHandler = (payload: any) => {
			const shouldRefetch = Array.isArray(rounds)
				? rounds.some(
						(r: any) =>
							r.symbol === payload.symbol && r.issueId === payload.issueId
				  )
				: false;

			if (shouldRefetch) {
				console.log('🔁 Refetching trade rounds...');
				refetch();
			}
		};

		socket.on('trade-placed', roundUpdatedHandler);

		return () => {
			socket.off('trade-placed', roundUpdatedHandler);
		};
	}, [socket, rounds, refetch]);

	return (
		<div>
			{/* <h1 className='text-xl font-bold mb-4 flex items-center gap-2'>
				📊 Signal Trades
			</h1> */}

			{isLoading ? (
				<div className='flex items-center justify-center border-2 border-gray-200 h-[312px] rounded-md p-4'>
					<RingLoader color='#0913da' size={70} />
				</div>
			) : (
				<div className='overflow-x-auto rounded-md shadow border border-gray-200'>
					{/* Period Header Section */}
					<div className='bg-gray-50 border-b px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2'>
						<div>
							<h2 className='text-sm text-gray-600'>
								<span className='font-semibold text-gray-800'>Round ID:</span>{' '}
								{rounds?.[0].issueId}
							</h2>
							<h2 className='text-sm text-gray-600'>
								<span className='font-semibold text-gray-800'>Start Time:</span>{' '}
								{formatTime(rounds?.[0].startTime)}
							</h2>
						</div>
						<div className='text-right'>
							<h2 className='text-sm text-gray-600'>
								<span className='font-semibold text-gray-800'>
									Time Period:
								</span>{' '}
								{rounds?.[0].timePeriod}
							</h2>
							<h2 className='text-sm text-gray-600'>
								<span className='font-semibold text-gray-800'>End Time:</span>{' '}
								{formatTime(rounds?.[0].endTime)}
							</h2>
						</div>
					</div>

					<table className='min-w-[800px] w-full text-sm text-left'>
						<thead className='bg-gray-100 font-semibold text-gray-700'>
							<tr>
								<th className='px-4 py-2 border'>Symbol</th>
								<th className='px-4 py-2 border text-center whitespace-nowrap'>
									<span className='inline-flex items-center gap-1 justify-center'>
										Entries <span>👥</span>
									</span>
								</th>
								<th className='px-4 py-2 border text-center whitespace-nowrap'>
									<span className='inline-flex items-center gap-1 justify-center'>
										Up <span>💚</span>
									</span>
								</th>
								<th className='px-4 py-2 border text-center whitespace-nowrap'>
									<span className='inline-flex items-center gap-1 justify-center'>
										Down <span>❤️</span>
									</span>
								</th>
								<th className='px-4 py-2 border text-center whitespace-nowrap'>
									<span className='inline-flex items-center gap-1 justify-center'>
										Sideways <span>💠</span>
									</span>
								</th>
								<th className='px-4 py-2 border text-center whitespace-nowrap'>
									<span className='inline-flex items-center gap-1 justify-center'>
										Start <span>🕒</span>
									</span>
								</th>
								<th className='px-4 py-2 border text-center whitespace-nowrap'>
									<span className='inline-flex items-center gap-1 justify-center'>
										End <span>🕒</span>
									</span>
								</th>
								<th className='px-4 py-2 border text-right whitespace-nowrap'>
									<span className='inline-flex items-center gap-1 justify-end'>
										Action <span>⚙️</span>
									</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{Array.isArray(rounds) && rounds.length > 0 ? (
								rounds.map((round: any) => (
									<tr
										key={round._id}
										className={`${getRowBg(
											round.symbol
										)} border hover:bg-opacity-80 transition`}
									>
										<td className='px-4 py-2 border font-medium text-gray-800'>
											{round.symbol}
										</td>
										<td className='px-4 py-2 border text-center'>
											{round.total_entries}
										</td>
										<td className='px-4 py-2 border text-center'>
											{formatBalance(round.total_up_amount)}$
										</td>
										<td className='px-4 py-2 border text-center'>
											{formatBalance(round.total_down_amount)}$
										</td>
										<td className='px-4 py-2 border text-center'>
											{formatBalance(round.total_sideways_amount)}$
										</td>
										<td className='px-4 py-2 border text-center text-gray-600'>
											{formatTime(round.startTime)}
										</td>
										<td className='px-4 py-2 border text-center text-gray-600'>
											{formatTime(round.endTime)}
										</td>
										<td className='px-4 py-2 border text-right font-semibold'>
											<Link
												href={`/trades/${round.symbol}/${round.issueId}`}
												className='text-blue-600 hover:text-blue-800 transition flex items-center gap-2 justify-end'
											>
												Details
												<span>
													<SquareArrowOutUpRight size={15} />
												</span>
											</Link>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={8} className='text-center py-4 text-gray-500'>
										No trade rounds found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default TradeRoundTable;
