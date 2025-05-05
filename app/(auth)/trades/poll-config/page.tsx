'use client';

import {
	useGetPoolConfigDataQuery,
	useUpdatePoolConfigMutation,
} from '@/redux/features/poolConfig/poolConfigApi';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import PoolHistoryTable from '@/components/Trades/PoolHistoryTable';

const PoolConfigPage = () => {
	const { data, isLoading } = useGetPoolConfigDataQuery(undefined);
	const [
		updatePoolConfig,
		{ isLoading: isUpdating, isSuccess, isError, error },
	] = useUpdatePoolConfigMutation();

	const { poolConfig: pool } = data || {};
	const [isEditing, setIsEditing] = useState(false);
	const [amount, setAmount] = useState<number>(0);
	const [type, setType] = useState<'add' | 'subtract'>('add');
	const [note, setNote] = useState('');

	const handleUpdate = () => {
		if (!amount) {
			toast.error('Amount is required');
			return;
		}

		const finalNote = note.trim()
			? note
			: type === 'add'
			? 'Manual Add'
			: 'Manual Subtract';

		updatePoolConfig({ amount, type, note: finalNote });
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success('Pool updated successfully');
			setIsEditing(false);
			setAmount(0);
			setNote('');
		}
		if (isError && error) {
			toast.error((error as any)?.data?.message || 'Update failed');
		}
	}, [isSuccess, isError, error]);

	return (
		<div className='p-4'>
			<h1 className='text-xl font-bold mb-4'>📊 Pool Config</h1>
			<div className='border p-4 rounded bg-gray-50 shadow space-y-2'>
				<p>
					<strong>Pool Name:</strong> {pool?.poolName}
				</p>
				<p>
					<strong>Balance:</strong> {pool?.balance.toFixed(2)}$
				</p>

				{isEditing ? (
					<div className='space-y-3'>
						<div className='flex gap-2'>
							<input
								type='number'
								value={amount}
								onChange={(e) => setAmount(Number(e.target.value))}
								placeholder='Amount'
								className='border rounded px-3 py-1 w-40'
							/>
							<select
								value={type}
								onChange={(e) => setType(e.target.value as 'add' | 'subtract')}
								className='border rounded px-3 py-1'
							>
								<option value='add'>Add</option>
								<option value='subtract'>Subtract</option>
							</select>
						</div>
						<textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder={`e.g. ${
								type === 'add' ? 'Manual Add' : 'Manual Subtract'
							}`}
							className='border rounded px-3 py-1 w-full'
						/>
						<button
							onClick={handleUpdate}
							disabled={isUpdating}
							className='bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded disabled:bg-gray-400'
						>
							{isUpdating ? <PulseLoader size={6} color='#fff' /> : 'Submit'}
						</button>
					</div>
				) : (
					<button
						onClick={() => setIsEditing(true)}
						className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded'
					>
						Edit Pool
					</button>
				)}
			</div>
			<div className='mt-4'>
				<PoolHistoryTable />
			</div>
		</div>
	);
};

export default PoolConfigPage;
