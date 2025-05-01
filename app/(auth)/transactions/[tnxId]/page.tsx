'use client';
import { formatDate, formDateWithTime } from '@/lib/functions';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import { useGetTransactionsByUserIdQuery } from '@/redux/features/admin/adminApi';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { LuMoveLeft } from 'react-icons/lu';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { GridLoader } from 'react-spinners';

const Transactions = ({ params }: any) => {
	const router = useRouter();
	const { tnxId } = params;

	// Local states for pagination
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	// Fetch transactions data with pagination (pass page and pageSize)
	const { data, isLoading, isError, error } = useGetTransactionsByUserIdQuery({
		id: tnxId,
		page: paginationModel.page,
		limit: paginationModel.pageSize,
	});
	const { transactions } = data || [];
	const { totalTransactions } = data || 0;

	// Define the columns for DataGrid
	const columns: GridColDef<any>[] = [
		{
			field: 'date',
			headerName: 'Created At',
			width: 150,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.date}</p>
				</div>
			),
		},
		{
			field: 'purpose',
			headerName: 'Purpose',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.purpose}</p>
				</div>
			),
		},
		{
			field: 'amount',
			headerName: 'Amount',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>
						{Number(params.row.amount).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</p>
				</div>
			),
		},
		{
			field: 'description',
			headerName: 'Description',
			width: 450,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.description}</p>
				</div>
			),
		},
	];

	// Prepare rows for DataGrid
	const rows = transactions?.map((transaction: any) => ({
		id: transaction._id,
		description: transaction.description,
		amount: transaction.amount,
		status: transaction.status,
		purpose: transaction.purpose,
		date: formDateWithTime(transaction.createdAt),
	}));

	// Handle pagination model change
	const handlePaginationModelChange = (
		newPaginationModel: GridPaginationModel
	) => {
		setPaginationModel(newPaginationModel);
	};

	return (
		<div>
			<div>
				<button
					className='flex items-center gap-1'
					onClick={() => router.back()}
				>
					<LuMoveLeft />
					Go Back
				</button>
			</div>
			<h3 className='text-center text-xl my-4'>All Transactions</h3>

			{isLoading ? (
				<div className='flex justify-center items-center my-6'>
					<GridLoader color='#2563EB' size={30} />
				</div>
			) : isError ? (
				<div className='text-center text-red-500'>
					<p>
						Error:{' '}
						{(error as fetchBaseQueryError).data?.message ||
							'Something went wrong!'}
					</p>
				</div>
			) : (
				<div>
					<DataGrid
						rows={rows || []}
						columns={columns}
						paginationModel={paginationModel}
						onPaginationModelChange={handlePaginationModelChange}
						rowCount={totalTransactions}
						paginationMode='server' // Enable server-side pagination
						autoHeight
					/>
				</div>
			)}
		</div>
	);
};

export default Transactions;
