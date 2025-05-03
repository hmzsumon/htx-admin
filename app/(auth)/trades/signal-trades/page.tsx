'use client';
import { formatBalance, formatTime } from '@/lib/functions';
import { useGetThreeMTradeDataQuery } from '@/redux/features/trade/tradeApi';
import React from 'react';
import { RingLoader } from 'react-spinners';

const SignalTradesPage = () => {
	const { data, isLoading } = useGetThreeMTradeDataQuery(undefined);
	const { tradeRounds } = data || [];
	console.log('tradeRounds', tradeRounds);

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

	return (
		<div className='p-4'>
			<h1 className='text-xl font-bold mb-4 flex items-center gap-2'>
				📊 Signal Trades
			</h1>

			{isLoading ? (
				<div className='flex items-center justify-center border-2 border-gray-200 h-[312px] rounded-md p-4'>
					<RingLoader color='#0913da' size={70} />
				</div>
			) : (
				<div className='overflow-x-auto rounded-md shadow border border-gray-200'>
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
										Buy Price <span>💰</span>
									</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{tradeRounds?.map((r: any) => (
								<tr
									key={r._id}
									className={`${getRowBg(
										r.symbol
									)} border hover:bg-opacity-80 transition`}
								>
									<td className='px-4 py-2 border font-medium text-gray-800'>
										{r.symbol}
									</td>
									<td className='px-4 py-2 border text-center'>
										{r.total_entries}
									</td>
									<td className='px-4 py-2 border text-center'>
										{formatBalance(r.total_up_amount)}$
									</td>
									<td className='px-4 py-2 border text-center'>
										{formatBalance(r.total_down_amount)}$
									</td>
									<td className='px-4 py-2 border text-center'>
										{formatBalance(r.total_sideways_amount)}$
									</td>
									<td className='px-4 py-2 border text-center text-gray-600'>
										{formatTime(r.startTime)}
									</td>
									<td className='px-4 py-2 border text-center text-gray-600'>
										{formatTime(r.endTime)}
									</td>
									<td className='px-4 py-2 border text-right font-semibold'>
										{r.buyPrice}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default SignalTradesPage;
