'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import { useTriggerForcedProfitByPackageMutation } from '@/redux/features/trade/tradeApi';
import { fetchBaseQueryError } from '@/redux/services/helpers';

interface TriggerProps {
	tradePackage: string;
}

const TriggerForcedProfitForm = ({ tradePackage }: TriggerProps) => {
	const [packageName, setPackageName] = useState('TradePro');
	const [profitPercent, setProfitPercent] = useState(20); // default 20%

	const [
		triggerForcedProfitByPackage,
		{ isLoading, isSuccess, isError, error },
	] = useTriggerForcedProfitByPackageMutation();

	// handle form submit
	const handleTriggerProfit = async () => {
		if (!packageName || !profitPercent) return toast.error('Fill all fields');
		await triggerForcedProfitByPackage({ packageName, profitPercent });
	};

	useEffect(() => {
		if (isError) {
			toast.error(
				(error as fetchBaseQueryError).data?.message || 'Something went wrong'
			);
		}
		if (isSuccess) {
			toast.success('🎉 Forced profit triggered successfully!');
		}
	}, [isError, isSuccess, error]);

	return (
		<div className='p-4 border rounded-lg bg-white shadow-sm'>
			<h3 className='text-lg font-semibold mb-3'>💰 Trigger Forced Profit</h3>

			<div className='flex flex-col gap-2'>
				<label className='text-sm font-medium'>Package Name</label>
				<select
					value={packageName}
					onChange={(e) => setPackageName(e.target.value)}
					className='border px-2 py-1 rounded'
				>
					<option value='TradeLite'>TradeLite</option>
					<option value='TradeElite'>TradeElite</option>
					<option value='TradePro'>TradePro</option>
					<option value='TradeMax'>TradeMax</option>
					<option value='TradeMaster'>TradeMaster</option>
					<option value='TradeInfinity'>TradeInfinity</option>
				</select>

				<label className='text-sm font-medium mt-2'>Profit %</label>
				<input
					type='number'
					value={profitPercent}
					onChange={(e) => setProfitPercent(Number(e.target.value))}
					className='border px-2 py-1 rounded'
					placeholder='e.g. 25'
				/>

				<button
					onClick={handleTriggerProfit}
					disabled={isLoading}
					className='mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 rounded'
				>
					{isLoading ? <PulseLoader color='#fff' size={6} /> : 'Trigger Profit'}
				</button>
			</div>
		</div>
	);
};

export default TriggerForcedProfitForm;
