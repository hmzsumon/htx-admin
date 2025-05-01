'use client';

import React, { useState } from 'react';
import {
	useGetLiveTradeProfitRateQuery,
	useUpdateLiveTradeProfitRateMutation,
} from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import { Pencil } from 'lucide-react';

const LiveTradeProfitRate = () => {
	const { data, isLoading, isError } =
		useGetLiveTradeProfitRateQuery(undefined);
	const [updateLiveTradeProfitRate] = useUpdateLiveTradeProfitRateMutation();
	const [editingKey, setEditingKey] = useState<string | null>(null);
	const [newValue, setNewValue] = useState<number>(0);

	if (isLoading) return <p>Loading...</p>;
	if (isError || !data?.liveTradeProfitRate) return <p>Error loading data</p>;

	const rate = data.liveTradeProfitRate;

	const handleEdit = (key: string, current: number) => {
		setEditingKey(key);
		setNewValue(current);
	};

	const handleSave = async () => {
		if (editingKey === null) return;
		try {
			await updateLiveTradeProfitRate({ [editingKey]: newValue }).unwrap();
			toast.success(`Updated ${editingKey} to ${newValue}`);
			setEditingKey(null);
		} catch (err: any) {
			toast.error(err?.data?.message || 'Update failed');
		}
	};

	const formatDisplay = (value: number) =>
		`${value.toFixed(2)} (${(value * 100).toFixed(0)}%)`;

	const packageNames = [
		'TradeLite',
		'TradeElite',
		'TradePro',
		'TradeMax',
		'TradeMaster',
		'TradeInfinity',
	];

	return (
		<div className='p-4 bg-white rounded shadow-md w-full  mx-auto'>
			<h2 className='text-lg font-semibold mb-4'>📈 Live Trade Profit Rate</h2>
			<div className='space-y-3'>
				{packageNames.map((pkg) => (
					<div
						key={pkg}
						className='flex justify-between items-center border px-3 py-2 rounded'
					>
						<p className='font-medium text-gray-700'>{pkg}</p>
						{editingKey === pkg ? (
							<div className='flex items-center gap-2'>
								<input
									type='number'
									min={0}
									step={0.001}
									value={newValue}
									onChange={(e) => setNewValue(parseFloat(e.target.value))}
									className='border px-2 py-1 rounded w-24 text-sm'
								/>
								<button
									onClick={handleSave}
									className='bg-green-500 text-white text-xs px-3 py-1 rounded'
								>
									Save
								</button>
							</div>
						) : (
							<div className='flex items-center gap-2'>
								<p className='text-sm font-semibold text-blue-600'>
									{formatDisplay(rate[pkg] || 0)}
								</p>
								<Pencil
									size={16}
									className='text-gray-500 hover:text-black cursor-pointer'
									onClick={() => handleEdit(pkg, rate[pkg] || 0)}
								/>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default LiveTradeProfitRate;
