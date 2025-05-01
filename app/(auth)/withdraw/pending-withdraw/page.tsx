'use client';

import { formatDate } from '@/lib/functions';
import {
	useGetAllWithdrawRequestsQuery,
	useGetPendingWithdrawsQuery,
} from '@/redux/features/withdraw/withdrawApi';
import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { Card, Tabs } from 'flowbite-react';

type Withdraw = {
	id: string;
	name: string;
	customer_id: string;
	amount: number;
	status: string;
	date: string;
	tnx_id: string;
	sl_no: number;
};

const PendingWithdraw = () => {
	const { data, isLoading, isSuccess, isError, error } =
		useGetPendingWithdrawsQuery(undefined);
	const { withdraws } = data || [];
	const [selectedTab, setSelectedTab] = useState('all');

	// Calculate total deposit amount based on the selected tab's criteria
	const totalAmount = withdraws?.reduce((total: any, withdraw: any) => {
		return total + withdraw.amount;
	}, 0);

	const totalNetAmount = withdraws?.reduce((total: any, withdraw: any) => {
		return total + withdraw.net_amount;
	}, 0);

	const columns: GridColDef<any>[] = [
		{
			field: 'sl_no',
			headerName: 'SL No',
			width: 80,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.sl_no}</p>
				</div>
			),
		},
		{
			field: 'date',
			headerName: 'Created At',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.date}</p>
				</div>
			),
		},

		{
			field: 'customer_id',
			headerName: 'Customer ID',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.customer_id}</p>
				</div>
			),
		},
		{
			field: 'name',
			headerName: 'Name',
			width: 200,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.name}</p>
				</div>
			),
		},
		{
			field: 'method',
			headerName: 'Method',
			width: 150,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.method.name}</p>
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
			field: 'netAmount',
			headerName: 'Net Amount',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs text-danger'>
					<p>
						{Number(params.row.netAmount).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</p>
				</div>
			),
		},

		{
			field: 'status',
			headerName: 'Status',
			width: 100,
			renderCell: (params: any) => {
				return (
					<div className='flex items-center'>
						{params.row.status === 'pending' && (
							<p className='text-warning '>
								<span>Pending</span>
							</p>
						)}
						{params.row.status === 'approved' && (
							<p className='text-success '>
								<span>Approved</span>
							</p>
						)}

						{params.row.status === 'rejected' && (
							<p className='text-danger '>
								<span>Rejected</span>
							</p>
						)}
					</div>
				);
			},
		},
		{
			field: 'user_details',
			headerName: 'View',
			width: 60,
			renderCell: (params: any) => {
				return (
					<div
						className='d-flex align-items-center justify-content-center w-100'
						style={{ cursor: 'pointer' }}
					>
						<Link href={`/users/${params.row.user_id}`} passHref>
							<FaEye />
						</Link>
					</div>
				);
			},
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 60,
			renderCell: (params: any) => {
				return (
					<div
						className='d-flex align-items-center justify-content-center w-100'
						style={{ cursor: 'pointer' }}
					>
						<Link href={`/withdraw/${params.row.id}`} passHref>
							<FaEye />
						</Link>
					</div>
				);
			},
		},
	];

	const rows: any = [];

	withdraws &&
		withdraws?.map((withdraw: any) => {
			return rows.push({
				id: withdraw._id,
				sl_no: withdraw.sl_no,
				name: withdraw.name,
				customer_id: withdraw.partner_id,
				amount: withdraw.amount,
				netAmount: withdraw.net_amount,
				status: withdraw.status,
				method: withdraw.method,
				date: formatDate(withdraw.createdAt),
				user_id: withdraw.user_id,
			});
		});

	return (
		<div>
			<h2>All Withdraw</h2>
			<div>
				<Card className=' my-4'>
					<div className='flex items-center gap-4 '>
						<h3 className=''> All Withdraw :</h3>
						<p className='  '>Count {withdraws?.length}</p>
						<p className='  '>Amount: {totalAmount} USDT</p>
						<p className='  '>Net Amount: {totalNetAmount} USDT</p>
					</div>
				</Card>

				<DataGrid rows={rows} columns={columns} />
			</div>
		</div>
	);
};

export default PendingWithdraw;
