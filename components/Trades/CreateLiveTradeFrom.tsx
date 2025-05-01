'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import {
	useCreateLiveTradeMutation,
	useEndLiveTradeMutation,
	useGetLiveTradeForAdminQuery,
	useUpdateLiveTradeToActiveMutation,
} from '@/redux/features/trade/tradeApi';
import { Card, Select } from 'flowbite-react';
import { useSocket } from '@/context/SocketContext'; // ✅ import socket context

const symbols = [
	{ symbol: 'BTCUSDT' },
	{ symbol: 'ETHUSDT' },
	{ symbol: 'BNBUSDT' },
	{ symbol: 'SOLUSDT' },
	{ symbol: 'TRUMPUSDT' },
	{ symbol: 'LTCUSDT' },
];

interface CreateLiveTradeFromProps {
	liveTrade: any; // Replace with the actual type of liveTrade
	refetch: () => void; // Function to refetch data
}

const CreateLiveTradeFrom = ({
	liveTrade,
	refetch,
}: CreateLiveTradeFromProps) => {
	const [createLiveTrade, { isLoading, isError, isSuccess, error }] =
		useCreateLiveTradeMutation();

	// call update live trade to active
	const [
		updateLiveTradeToActive,
		{
			isLoading: isActiveLoading,
			isError: isActiveError,
			isSuccess: isActiveSuccess,
			error: activeError,
		},
	] = useUpdateLiveTradeToActiveMutation();

	//handle update live trade to active
	const handleUpdateLiveTradeToActive = async () => {
		const data = {
			id: liveTrade?._id,
		};

		updateLiveTradeToActive(data);
	};

	// for active trade useEffect
	useEffect(() => {
		if (isActiveError && activeError) {
			toast.error((activeError as fetchBaseQueryError).data?.message);
		}
		if (isActiveSuccess) {
			toast.success('Live trade updated to active successfully!');
			// refetch();
		}
	}, [isActiveError, activeError, isActiveSuccess, refetch]);

	// call end live trade mutation
	const [
		endLiveTrade,
		{
			isLoading: isEndLoading,
			isError: isEndError,
			isSuccess: isEndSuccess,
			error: endError,
		},
	] = useEndLiveTradeMutation();
	// handle end live trade
	const handleEndLiveTrade = async () => {
		const data = {
			id: liveTrade?._id,
		};

		endLiveTrade(data);
	};
	// handle end live trade success and error
	useEffect(() => {
		if (isEndError && endError) {
			toast.error((endError as fetchBaseQueryError).data?.message);
		}
		if (isEndSuccess) {
			toast.success('Live trade ended successfully!');
		}
	}, [isEndError, endError, isEndSuccess, refetch]);

	const [selectedSymbol, setSelectedSymbol] = useState(symbols[0].symbol);

	const handleSelectChange = (event: any) => {
		setSelectedSymbol(event.target.value);
	};

	// handle create live trade
	const handleCreateLiveTrade = async () => {
		const data = {
			symbol: selectedSymbol,
		};

		createLiveTrade(data);
	};

	// handle error and success
	useEffect(() => {
		if (isError && error) {
			toast.error((error as fetchBaseQueryError).data?.message);
		}
		if (isSuccess) {
			toast.success('Live trade created successfully!');
			refetch(); // ✅ recreate
		}
	}, [isError, error, isSuccess, refetch]);

	return (
		<div>
			<div className='mt-4'>
				<Card className='w-full bg-gray-200'>
					{liveTrade?.is_upcoming || liveTrade?.is_active ? (
						<div>
							<div>
								<div className='flex justify-between items-center'>
									<h2 className='mb-2'>Upcoming Live Trade Users :</h2>
									<p className='text-gray-600'>
										{liveTrade?.totalParticipants} users
									</p>
								</div>
								<div className='flex justify-between items-center'>
									<p className='text-gray-600'>Total Trade Amount : </p>
									<span className='font-semibold'>
										{liveTrade?.totalTradeAmount} USDT
									</span>
								</div>
							</div>
							{/* Start and end live trade button */}
							<div>
								{liveTrade?.is_active ? (
									<button
										className='bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-600 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
										onClick={handleEndLiveTrade}
										disabled={isLoading || !selectedSymbol}
									>
										{isEndLoading ? (
											<PulseLoader color='#fff' size={8} className='mr-2' />
										) : (
											'End Live Trade'
										)}
									</button>
								) : (
									<button
										className='bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-600 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
										onClick={handleUpdateLiveTradeToActive}
										disabled={isLoading || !selectedSymbol}
									>
										{isActiveLoading ? (
											<PulseLoader color='#fff' size={8} className='mr-2' />
										) : (
											'Start Live Trade'
										)}
									</button>
								)}
							</div>
						</div>
					) : (
						<div>
							<h2 className='mb-2'>Select a coin to create a live trade.</h2>
							<Select
								id='coins'
								required
								onChange={handleSelectChange}
								value={selectedSymbol}
							>
								{symbols.map((symbol) => (
									<option key={symbol.symbol} value={symbol.symbol}>
										{symbol.symbol}
									</option>
								))}
							</Select>

							<button
								className='bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
								onClick={handleCreateLiveTrade}
								disabled={isLoading || !selectedSymbol}
							>
								{isLoading ? (
									<PulseLoader color='#fff' size={8} className='mr-2' />
								) : (
									'Create Live Trade'
								)}
							</button>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default CreateLiveTradeFrom;
