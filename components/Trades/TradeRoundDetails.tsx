'use client';

import React from 'react';
import { formatBalance, formatTime } from '@/lib/functions';
import { BadgeInfo } from 'lucide-react';

const TradeRoundDetails = ({ round }: any) => {
	if (!round) return null;

	return (
		<div className='p-6 rounded-lg border shadow bg-white'>
			<h2 className='text-xl font-bold flex items-center gap-2 mb-6'>
				<BadgeInfo size={20} className='text-blue-600' />
				Trade Round Details
			</h2>

			<div className='grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-10 text-sm text-gray-800'>
				<p>
					<span className='font-semibold'>🪙 Symbol:</span> {round.symbol}
				</p>
				<p>
					<span className='font-semibold'>🆔 Issue ID:</span> {round.issueId}
				</p>
				<p>
					<span className='font-semibold'>⏱ Time Period:</span>{' '}
					{round.timePeriod}
				</p>
				<p>
					<span className='font-semibold'>🕒 Start:</span>{' '}
					{formatTime(round.startTime)}
				</p>
				<p>
					<span className='font-semibold'>⏳ End:</span>{' '}
					{formatTime(round.endTime)}
				</p>
				<p>
					<span className='font-semibold'>💰 Buy Price:</span>{' '}
					{round.buyPrice.toFixed(2)}
				</p>
				<p>
					<span className='font-semibold'>📉 Sell Price:</span>{' '}
					{round.sellPrice?.toFixed(2) || '--'}
				</p>
				<p>
					<span className='font-semibold'>🏁 Result:</span>{' '}
					{round.result || '--'}
				</p>
				<p>
					<span className='font-semibold'>👥 Total Entries:</span>{' '}
					{round.total_entries}
				</p>
				<p>
					<span className='font-semibold'>💚 Up Amount:</span>{' '}
					{formatBalance(round.total_up_amount)}$
				</p>
				<p>
					<span className='font-semibold'>❤️ Down Amount:</span>{' '}
					{formatBalance(round.total_down_amount)}$
				</p>
				<p>
					<span className='font-semibold'>💠 Sideways Amount:</span>{' '}
					{formatBalance(round.total_sideways_amount)}$
				</p>
			</div>
		</div>
	);
};

export default TradeRoundDetails;
