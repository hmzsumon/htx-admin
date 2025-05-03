'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import clsx from 'clsx';
import axios from 'axios';

import Countdown from './Countdown';
import { useDeclareManualResultMutation } from '@/redux/features/trade/tradeApi';

const AdminResultPanel = ({ round }: { round: any }) => {
	const [selectedResult, setSelectedResult] = useState('');
	const [loading, setLoading] = useState(false);

	const [declareManualResult, { isLoading, isSuccess, isError, error }] =
		useDeclareManualResultMutation();

	const amounts = [
		{ type: 'Up', amount: round.total_up_amount },
		{ type: 'Down', amount: round.total_down_amount },
		{ type: 'Sideways', amount: round.total_sideways_amount },
	];

	const lowest = amounts.reduce((min, curr) =>
		curr.amount < min.amount ? curr : min
	);

	const handleDeclare = async () => {
		const data = {
			issueId: round.issueId,
			symbol: round.symbol,
			result: selectedResult,
		};
		declareManualResult(data);
	};

	// handle toast feedback
	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || 'Something went wrong');
		}
		if (isSuccess) {
			toast.success(
				`Result declared successfully for ${round.symbol} - ${round.issueId}`
			);
			setLoading(false);
		}
	}, [isError, isSuccess, error]);

	return (
		<div className='p-4 mt-6 border rounded bg-gray-50 shadow-md'>
			<div className='mb-4 flex items-center gap-2'>
				<h2 className='text-lg font-semibold'>🧠 Declare Round Result</h2>
				<Countdown endTime={round?.endTime} />
			</div>

			<div className='flex gap-4 flex-wrap'>
				{amounts.map(({ type, amount }) => (
					<button
						key={type}
						onClick={() => setSelectedResult(type)}
						className={clsx(
							'px-4 py-2 rounded border font-medium transition',
							selectedResult === type
								? 'bg-blue-600 text-white border-blue-600'
								: 'bg-white text-gray-700 hover:bg-gray-100',
							lowest.type === type && 'animate-pulse border-2 border-pink-500'
						)}
					>
						{type} ({amount.toFixed(2)}$)
						{lowest.type === type && (
							<span className='ml-2 text-pink-600 font-bold'>(Least)</span>
						)}
					</button>
				))}
			</div>

			<button
				disabled={!selectedResult || loading}
				onClick={handleDeclare}
				className='mt-4 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-300'
			>
				{loading ? 'Declaring...' : 'Declare Result'}
			</button>
		</div>
	);
};

export default AdminResultPanel;
