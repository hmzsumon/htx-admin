'use client';

import React from 'react';
import { useGetPoolHistoryQuery } from '@/redux/features/poolConfig/poolConfigApi';
import {
	CustomLoadingOverlay,
	CustomNoRowsOverlay,
} from './LiveTradeUsersTable';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formDateWithTime } from '@/lib/functions';
// import dayjs from 'dayjs';

const PoolHistoryTable = () => {
	const { data, isLoading } = useGetPoolHistoryQuery(undefined);
	const { poolHistory } = data || {};

	const rows =
		poolHistory?.map((p: any) => ({
			id: p._id,
			poolName: p.poolName,
			symbol: p.symbol,
			roundId: p.roundId,
			totalProfitIn: p.totalProfitIn,
			totalProfitOut: p.totalProfitOut,
			balanceBefore: p.balanceBefore,
			balanceAfter: p.balanceAfter,
			amount: p.amount,
			type: p.type,
			isProfit: p.isProfit,
			note: p.note,
			createdAt: formDateWithTime(p.createdAt),
		})) || [];

	const columns: GridColDef[] = [
		{ field: 'createdAt', headerName: 'Time', width: 170 },
		{ field: 'symbol', headerName: 'Symbol', width: 100 },
		{ field: 'roundId', headerName: 'Round ID', width: 130 },
		{
			field: 'type',
			headerName: 'Type',
			width: 90,
			renderCell: (params) => (
				<span
					className={`font-semibold ${
						params.value === 'add' ? 'text-green-600' : 'text-red-600'
					}`}
				>
					<span>{params.value === 'add' ? '+' : '-'}</span>{' '}
					<span className=' capitalize'>{params.value}</span>
				</span>
			),
		},
		{
			field: 'amount',
			headerName: 'Amount',
			width: 100,
			renderCell: (params) => (
				<span
					className={`font-semibold ${
						params.value > 0 ? 'text-green-600' : 'text-red-600'
					}`}
				>
					{params.value}$
				</span>
			),
		},
		{ field: 'balanceBefore', headerName: 'Before', width: 100 },
		{ field: 'balanceAfter', headerName: 'After', width: 100 },
		{ field: 'totalProfitIn', headerName: 'Profit In', width: 100 },
		{ field: 'totalProfitOut', headerName: 'Profit Out', width: 100 },
		{
			field: 'isProfit',
			headerName: 'Profit?',
			width: 90,
			renderCell: (params) => (
				<span
					className={`font-semibold ${
						params.value ? 'text-green-600' : 'text-red-600'
					}`}
				>
					{params.value ? 'Yes' : 'No'}
				</span>
			),
		},
		{ field: 'note', headerName: 'Note', width: 250 },
	];

	return (
		<div className='flex flex-col gap-4'>
			<div className='w-full h-[500px] bg-white rounded-md shadow-md'>
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

export default PoolHistoryTable;
