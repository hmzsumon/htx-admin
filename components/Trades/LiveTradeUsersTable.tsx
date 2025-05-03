'use client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Image from 'next/image';
import React, { useState } from 'react';
import ImgNodata from '@/public/images/no-data.gif';
import { Box, CircularProgress } from '@mui/material';
import TriggerForcedLossForm from './TriggerForcedLossForm';
import TriggerForcedProfitForm from './TriggerForcedProfitForm';

interface LiveTradeUsersTableProps {
	liveTrade: any;
	isLoading?: boolean;
}

const tabes = [
	'All',
	'TradeLite',
	'TradeElite',
	'TradePro',
	'TradeMax',
	'TradeMaster',
	'TradeInfinity',
];

export function CustomNoRowsOverlay() {
	return (
		<div className='w-full h-full items-center justify-center flex'>
			<div>
				<Image src={ImgNodata} alt='No data' width={150} height={150} />
				<p className='text-sm text-gray-500 text-center'>No data available</p>
			</div>
		</div>
	);
}

export function CustomLoadingOverlay() {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100%',
			}}
		>
			<CircularProgress />
			<p style={{ marginTop: 10, fontSize: '0.875rem', color: '#666' }}>
				Loading Members...
			</p>
		</Box>
	);
}

const LiveTradeUsersTable = ({
	liveTrade,
	isLoading,
}: LiveTradeUsersTableProps) => {
	const participants = liveTrade?.participants || [];
	const [selectedPackage, setSelectedPackage] = useState('All');

	const filteredParticipants =
		selectedPackage === 'All'
			? participants
			: participants.filter((p: any) => p.tradePackage === selectedPackage);

	console.log('filteredParticipants', filteredParticipants);

	const rows: any = [];

	filteredParticipants.length > 0 &&
		filteredParticipants.map((p: any) => {
			return rows.unshift({
				id: p.userId || p._id,
				name: p.name,
				customer_id: p.customer_id,
				initialBalance: p.initialBalance,
				currentBalance: p.currentBalance,
				package: p.tradePackage,
				percentChange: p.percentChange,
				addedAmount: p.addedAmount,
				isAddedBalance: p.isAddedBalance,
			});
		});

	const columns: GridColDef<(typeof rows)[number]>[] = [
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'customer_id', headerName: 'UID', width: 80 },
		{
			field: 'initialBalance',
			headerName: 'Initial Balance',
			width: 150,
			renderCell: (params: any) => (
				<span
					className={
						params.row.isAddedBalance
							? 'text-green-500 font-semibold'
							: 'text-red-500 font-semibold'
					}
				>
					{params.row.initialBalance} $
				</span>
			),
		},
		{
			field: 'currentBalance',
			headerName: 'Current Balance',
			width: 150,
			renderCell: (params: any) => (
				<span
					className={
						params.row.isAddedBalance
							? 'text-green-500 font-semibold'
							: 'text-red-500 font-semibold'
					}
				>
					{params.row.currentBalance} $
				</span>
			),
		},
		{
			field: 'package',
			headerName: 'Package',
			width: 100,
			renderCell: (params: any) => (
				<p className='text-gray-500 font-semibold'>{params.row.package}</p>
			),
		},
		{
			field: 'percentChange',
			headerName: 'Net % Change',
			width: 150,
			renderCell: (params: any) => (
				<p
					className={`font-semibold ${
						params.row.percentChange > 0 ? 'text-green-500' : 'text-red-500'
					}`}
				>
					{params.row.percentChange} %
				</p>
			),
		},
		{
			field: 'addedAmount',
			headerName: 'Added Amount',
			width: 150,
			renderCell: (params: any) => (
				<p className='text-gray-500 font-semibold'>
					{params.row.addedAmount} $
				</p>
			),
		},

		{
			field: 'isAddedBalance',
			headerName: 'Added Balance',
			width: 150,
			renderCell: (params: any) => (
				<p className='text-gray-500 font-semibold'>
					{params.row.isAddedBalance ? 'Yes' : 'No'}
				</p>
			),
		},
	];

	return (
		<div className='flex flex-col gap-4'>
			{/* Custom Tabs */}
			<div className='flex flex-wrap gap-2'>
				{tabes.map((pkg) => {
					const filtered =
						pkg === 'All'
							? participants
							: participants.filter((p: any) => p.tradePackage === pkg);

					const total = filtered.reduce(
						(sum: number, p: { initialBalance?: number }) =>
							sum + (p.initialBalance || 0),
						0
					);

					return (
						<div key={pkg} className='flex flex-1 justify-center'>
							<button
								key={pkg}
								onClick={() => setSelectedPackage(pkg)}
								className={`px-4 py-2 w-full rounded-md text-sm font-medium border ${
									selectedPackage === pkg
										? 'bg-blue-600 text-white'
										: 'bg-gray-400 text-gray-800'
								}`}
							>
								<div className='flex flex-col items-center'>
									<span>{pkg}</span>
									<span className='text-xs text-gray-200'>
										${total.toFixed(2)}
									</span>
								</div>
							</button>
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{/* Start Trigger Forced LossForm */}
				<div>
					<TriggerForcedLossForm tradePackage={selectedPackage} />
				</div>
				{/* EndTrigger Forced LossForm  */}

				{/* Start Trigger Forced ProfitForm */}
				<div>
					<TriggerForcedProfitForm tradePackage={selectedPackage} />
				</div>
				{/* End Trigger Forced ProfitForm  */}
			</div>

			{/* DataGrid */}
			<div className='w-full h-[400px] bg-white rounded-md shadow-md'>
				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: { pageSize: 10 },
						},
					}}
					pageSizeOptions={[10, 20, 50]}
					disableRowSelectionOnClick
					loading={isLoading}
					slots={{
						noRowsOverlay: CustomNoRowsOverlay,
						loadingOverlay: CustomLoadingOverlay,
					}}
					sx={{
						'& .MuiDataGrid-cell': {
							fontSize: '0.75rem',
							color: '#333',
						},
						'& .MuiDataGrid-columnHeaders': {
							fontSize: '0.875rem',
							fontWeight: '600',
							backgroundColor: '#f8f8f8',
						},
					}}
				/>
			</div>
		</div>
	);
};

export default LiveTradeUsersTable;
