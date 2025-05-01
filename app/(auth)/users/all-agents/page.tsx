'use client';
import { formatDate } from '@/lib/functions';
import {
	useGetAllAgentsQuery,
	useGetUsersQuery,
} from '@/redux/features/auth/authApi';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Card } from 'flowbite-react';
import Link from 'next/link';
import React from 'react';
import { FaEye } from 'react-icons/fa';

const AllAgents = () => {
	const { data, isLoading, isError, isSuccess, error } = useGetAllAgentsQuery();
	const { agents } = data || [];
	const columns = [
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
			field: 'name',
			headerName: 'Name',
			width: 250,
			renderCell: (params: any) => (
				<div className=''>
					<p>{params.row.name}</p>
				</div>
			),
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 250,
			renderCell: (params: any) => (
				<div className=''>
					<p>{params.row.email}</p>
				</div>
			),
		},

		{
			field: 'partner_id',
			headerName: 'Partner ID',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.partner_id}</p>
				</div>
			),
		},

		{
			field: 'kyc',
			headerName: 'KYC',
			width: 80,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>
						{params.row.kyc ? (
							<span className='text-green-500'>Yes</span>
						) : (
							<span className='text-orange-500'>No</span>
						)}
					</p>
				</div>
			),
		},

		{
			field: 'rank',
			headerName: 'Rank',
			width: 80,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.rank}</p>
				</div>
			),
		},

		{
			field: 'is_active',
			headerName: 'Status',
			width: 80,
			renderCell: (params: any) => {
				return (
					<div className='flex items-center'>
						{params.row.is_active ? (
							<p className='text-green-500 '>
								<span>Active</span>
							</p>
						) : (
							<p className='text-orange-500'>
								<span>Inactive</span>
							</p>
						)}
					</div>
				);
			},
		},
		{
			field: 'block',
			headerName: 'Block',
			width: 100,
			renderCell: (params: any) => {
				return (
					<div className='flex items-center'>
						{params.row.block === true && (
							<p className='text-danger '>
								<span>Blocked</span>
							</p>
						)}

						{params.row.block === false && (
							<p className='text-success '>
								<span>Not Blocked</span>
							</p>
						)}
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
					<div className='flex items-center justify-center  w-full'>
						<Link href={`/users/${params.row.id}`} passHref>
							<span className='text-center bg-red-500'>
								<FaEye />
							</span>
						</Link>
					</div>
				);
			},
		},
	];

	const rows: any = [];

	agents &&
		agents.map((user: any) => {
			return rows.unshift({
				id: user._id,
				name: user.name,
				email: user.email,
				partner_id: user.partner_id,
				date: formatDate(user.createdAt),
				is_active: user.is_active,
				block: user.is_block,
				rank: user.rank,
				kyc: user.kyc_verified,
			});
		});
	return (
		<div>
			<div style={{ height: '100%', width: '100%' }}>
				<Card className='my-2 d-flex align-items-center '>
					<div className='gap-2 flex list-none '>
						<li className='text-success h5'> Total Agents :</li>
						<li className=' text-success h5'>{agents?.length}</li>
					</div>
				</Card>
				<Box sx={{ height: '100%', width: '100%' }}>
					<DataGrid rows={rows} columns={columns} loading={isLoading} />
				</Box>
			</div>
		</div>
	);
};

export default AllAgents;
