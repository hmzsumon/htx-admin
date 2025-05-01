'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import { useTriggerForcedLossByPackageMutation } from '@/redux/features/trade/tradeApi';

interface TriggerProps {
	tradePackage: string;
}

const TriggerForcedLossForm = ({ tradePackage }: TriggerProps) => {
	const [lossPercent, setLossPercent] = useState<number>(15); // Default 15%

	const [triggerForcedLossByPackage, { isLoading, isError, isSuccess, error }] =
		useTriggerForcedLossByPackageMutation();

	// handle trigger forced loss
	const handleTriggerForcedLoss = async () => {
		if (lossPercent < 1 || lossPercent > 99) {
			toast.warning('Please enter a loss percentage between 1 and 99.');
			return;
		}

		const data = {
			packageName: tradePackage,
			lossPercent: lossPercent,
		};
		await triggerForcedLossByPackage(data);
	};

	// handle toast feedback
	useEffect(() => {
		if (isError) {
			toast.error(
				(error as fetchBaseQueryError)?.data?.message || 'Something went wrong'
			);
		}
		if (isSuccess) {
			toast.success(
				`Forced loss of ${lossPercent}% applied to ${tradePackage}`
			);
		}
	}, [isError, isSuccess, error]);

	return (
		<div className='p-4 border rounded shadow-md bg-white w-full  space-y-4'>
			<h2 className='text-lg font-semibold'>
				Trigger Forced Loss for{' '}
				<span className='text-blue-600'>{tradePackage}</span>
			</h2>

			<div className='flex flex-col gap-2'>
				<label className='text-sm font-medium text-gray-700'>
					Loss Percentage (%)
				</label>
				<input
					type='number'
					value={lossPercent}
					onChange={(e) => setLossPercent(Number(e.target.value))}
					className='border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
					placeholder='Enter % (e.g. 10)'
					min={1}
					max={99}
				/>
			</div>

			<button
				onClick={handleTriggerForcedLoss}
				disabled={isLoading}
				className='w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50'
			>
				{isLoading ? <PulseLoader size={8} color='#fff' /> : 'Trigger Loss'}
			</button>
		</div>
	);
};

export default TriggerForcedLossForm;
