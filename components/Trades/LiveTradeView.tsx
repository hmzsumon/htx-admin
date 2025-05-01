'use client';
import React from 'react';
import LiveTradeUsersTable from './LiveTradeUsersTable';

interface LiveTradeViewProps {
	liveTrade: any;
	isLoading?: boolean;
}

const LiveTradeView = ({ liveTrade, isLoading }: LiveTradeViewProps) => {
	const totalInitialBalance = liveTrade?.participants.reduce(
		(acc: number, user: any) => acc + user.initialBalance,
		0
	);

	const totalCurrentBalance = liveTrade?.participants.reduce(
		(acc: number, user: any) => acc + user.currentBalance,
		0
	);

	return (
		<div>
			<div className='flex flex-col gap-4'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-xl font-bold'>{liveTrade?.title}</h1>
				</div>

				<div className='flex  text-xs flex-col gap-4 p-4 border rounded-lg bg-white shadow-sm'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<span className=' font-semibold'>Live Trade Status:</span>
							<span
								className={`${
									liveTrade?.is_active ? 'text-green-500' : 'text-red-500'
								} font-semibold`}
							>
								{liveTrade?.is_active ? 'Live' : 'Not Live'}
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<span className=' font-semibold'>Total Users:</span>
							<span className='font-semibold'>
								{liveTrade?.participants.length || 0}
							</span>
						</div>
					</div>

					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<span className=' font-semibold'>Total Initial Balance:</span>
							<span className='font-semibold'>
								{totalInitialBalance?.toLocaleString('en-US', {
									style: 'currency',
									currency: 'USD',
								})}
							</span>
						</div>

						<div className='flex items-center gap-2'>
							<span className=' font-semibold'>Total Added Balance:</span>
							<span className='font-semibold'>
								{liveTrade?.totalAddBalance?.toLocaleString('en-US', {
									style: 'currency',
									currency: 'USD',
								})}
							</span>
						</div>

						<div className='flex items-center gap-2'>
							<span className=' font-semibold'>Total Current Balance:</span>
							<span className='font-semibold'>
								{totalCurrentBalance?.toLocaleString('en-US', {
									style: 'currency',
									currency: 'USD',
								})}
							</span>
						</div>
					</div>
				</div>
				<div className='flex flex-col gap-4'>
					<LiveTradeUsersTable liveTrade={liveTrade} isLoading={isLoading} />
				</div>
			</div>
		</div>
	);
};

export default LiveTradeView;
