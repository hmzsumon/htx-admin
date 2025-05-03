'use client';

import React from 'react';
import { formatTime } from '@/lib/functions';

interface RoundData {
	symbol: string;
	issueId: string;
	timePeriod: string;
	startTime: string;
	endTime: string;
	buyPrice: number;
	sellPrice: number;
	result: string;
	total_entries: number;
	total_up_amount: number;
	total_down_amount: number;
	total_sideways_amount: number;
	total_winners: number;
	total_losers: number;
	total_sideways: number;
	total_profit: number;
	total_loss: number;
	is_signal_trade: boolean;
	is_active: boolean;
	createdAt: string;
	updatedAt: string;
}

const AdminRoundCard = ({ round }: { round: RoundData }) => {
	return (
		<div className='bg-white shadow-md rounded-lg p-4 border w-full max-w-xl mx-auto'>
			<div className='flex justify-between items-center mb-2'>
				{!round?.is_active && (
					<span
						className={`text-xs px-2 py-1 rounded-full ${
							round.result === 'Up'
								? 'bg-green-100 text-green-700'
								: round.result === 'Down'
								? 'bg-red-100 text-red-700'
								: 'bg-yellow-100 text-yellow-700'
						}`}
					>
						Result: {round.result}
					</span>
				)}
			</div>

			<div className='text-sm grid grid-cols-2 gap-x-4 gap-y-2'>
				<p>
					<strong>Round ID:</strong> {round.issueId}
				</p>
				<p>
					<strong>Time Period:</strong> {round.timePeriod}
				</p>
			</div>
		</div>
	);
};

export default AdminRoundCard;
