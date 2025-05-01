'use client';
import { toast } from 'react-toastify';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import CopyToClipboard from '@/lib/CopyToClipboard';
import {
	useBlockUserMutation,
	useGetUserByIdQuery,
	useWithdrawBlockMutation,
} from '@/redux/features/admin/adminApi';
import { Card, ListGroup } from 'flowbite-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BeatLoader, GridLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { LuMoveLeft } from 'react-icons/lu';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import ToggleSwitch from '@/components/ToggleSwitch';

const UserDetails = ({ params }: any) => {
	const router = useRouter();
	const { id } = params;
	const { data, isLoading, isError, isSuccess, error } =
		useGetUserByIdQuery(id);
	const { user, wallet } = data || {};

	const [
		blockUser,
		{ isLoading: isBlocking, isError: isBlocError, error: blockError },
	] = useBlockUserMutation();
	const [
		withdrawBlock,
		{ isLoading: isLoadingBlock, isSuccess: isSuccessBlock },
	] = useWithdrawBlockMutation();

	// ✅ Two separate toggle states
	const [isWithdrawBlocked, setIsWithdrawBlocked] = useState(false);
	const [isUserBlocked, setIsUserBlocked] = useState(false);

	// ✅ Set values from user data
	useEffect(() => {
		if (user) {
			setIsWithdrawBlocked(user?.is_withdraw_block || false);
			setIsUserBlocked(user?.is_block || false); // Assuming user has is_blocked field
		}
	}, [user]);

	// ✅ Handle withdraw block toggle
	const handleToggleWithdrawChange = async (checked: boolean) => {
		setIsWithdrawBlocked(checked);
		try {
			await withdrawBlock({ partner_id: user?.partner_id }).unwrap();
			toast.success('Withdraw block/unblock successful');
		} catch (error) {
			setIsWithdrawBlocked(!checked);
			console.error('Withdraw block toggle error:', error);
		}
	};

	// ✅ Handle user block toggle
	const handleToggleUserBlock = async (checked: boolean) => {
		setIsUserBlocked(checked);
		try {
			await blockUser({ partner_id: user?.partner_id }).unwrap();
			toast.success('User block/unblock successful');
		} catch (error) {
			setIsUserBlocked(!checked);
			console.error('User block toggle error:', error);
		}
	};

	useEffect(() => {
		if (isBlocError && blockError) {
			toast.error((blockError as fetchBaseQueryError).data?.message);
		}
	}, [isBlocError, blockError]);

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
			<div className='text-left'>
				<h1 className='text-2xl font-semibold text-center'>User details</h1>
			</div>

			{isLoading ? (
				<div className='flex justify-center items-center my-6'>
					<GridLoader color='#2563EB' size={30} />
				</div>
			) : (
				<div className='my-4 space-y-4'>
					{/* User Info */}
					<div>
						<h3 className='font-bold ml-2 my-1'>
							User Info
							<span>
								{user?.is_active ? (
									<span className='text-green-500 ml-2'>Active</span>
								) : (
									<span className='text-red-500 ml-2'>Inactive</span>
								)}
							</span>
						</h3>

						{/* 🔁 User Block Toggle */}
						<div className='my-2'>
							{isBlocking ? (
								<BeatLoader color='#2563EB' size={10} />
							) : (
								<ToggleSwitch
									title={
										isUserBlocked
											? 'Click to Unblock User'
											: 'Click to Block User'
									}
									checked={isUserBlocked}
									onChange={handleToggleUserBlock}
								/>
							)}
						</div>

						{/* 🔁 Withdraw Block Toggle */}
						<div className='my-2'>
							{isLoadingBlock ? (
								<BeatLoader color='#2563EB' size={10} />
							) : (
								<ToggleSwitch
									title={
										isWithdrawBlocked
											? 'Click to Unblock Withdraw'
											: 'Click to Block Withdraw'
									}
									checked={isWithdrawBlocked}
									onChange={handleToggleWithdrawChange}
								/>
							)}
						</div>

						<ListGroup>
							<ListGroup.Item>
								<span className='flex gap-4'>
									<span>User name:</span>
									<span className='font-bold'>{user?.name || 'N/A'}</span>
									<span className='font-bold capitalize text-orange-400'>
										({user?.role || 'N/A'})
									</span>
								</span>
							</ListGroup.Item>

							<ListGroup.Item>
								<span className='flex gap-4 items-center'>
									<span>User Id:</span>
									<span className='flex items-center gap-1 font-bold'>
										{user?.partner_id || 'N/A'}
									</span>
								</span>
								<CopyToClipboard text={user?.partner_id} />
							</ListGroup.Item>

							<ListGroup.Item>
								<span className='flex items-center gap-4 '>
									<span>Phone:</span>
									<span className='font-bold'>{user?.mobile}</span>
								</span>
							</ListGroup.Item>

							<ListGroup.Item>
								<span className='flex items-center gap-4 '>
									<span>Email:</span>
									<span className='font-bold'>{user?.email}</span>
								</span>
								<CopyToClipboard text={user?.customer_id} />
							</ListGroup.Item>

							<ListGroup.Item>
								<span className='flex items-center gap-4'>
									<span>Date Time:</span>
									<span className='font-bold'>
										{new Date(user?.createdAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
											hour: 'numeric',
											minute: 'numeric',
										})}
									</span>
								</span>
							</ListGroup.Item>

							<ListGroup.Item>
								<span className='flex items-center gap-4 '>
									<span>Owner name:</span>
									<span className='font-bold'>{user?.owner_name}</span>
								</span>
							</ListGroup.Item>

							<ListGroup.Item>
								<span className='flex items-center gap-4 '>
									<span>Sponsor name:</span>
									<span className='font-bold'>{user?.sponsor?.name}</span>
								</span>
								<Link
									href={`/users/${user?.sponsor?.user_id}`}
									className='flex items-center gap-1'
								>
									<FaExternalLinkAlt className='ml-2 text-sm text-blue-500' />
								</Link>
							</ListGroup.Item>
						</ListGroup>
					</div>

					{/* Balance Info */}
					<div>
						<h3 className='font-bold ml-2 my-1'>Balance Info</h3>
						<ListGroup>
							{[
								{ label: 'Main balance', value: user?.m_balance },
								{ label: 'Game balance', value: user?.g_balance },
							].map((item, i) => (
								<ListGroup.Item key={i}>
									<span className='flex items-center gap-4'>
										<span>{item.label}:</span>
										<span className='font-bold'>
											{Number(item.value).toLocaleString('en-US', {
												style: 'currency',
												currency: 'USD',
											})}
										</span>
									</span>
								</ListGroup.Item>
							))}
						</ListGroup>
					</div>

					{/* Wallet Info */}
					<div>
						<div className='flex items-center gap-2'>
							<h3 className='font-bold ml-2 my-1'>Wallet Info</h3>
							<Link
								href={`/transactions/${id}`}
								className='flex items-center gap-1'
							>
								<span className='text-blue-500'>View Transactions</span>
								<FaExternalLinkAlt className='text-sm text-blue-500' />
							</Link>
						</div>
						<ListGroup>
							{[
								['Total Deposit', wallet?.total_deposit],
								['Total Receive', wallet?.total_receive_amount],
								['Total Invest', wallet?.total_investment],
								['Total Withdraw', wallet?.total_withdraw],
								['Total Send', wallet?.total_send_amount],
								['Total Earning', wallet?.total_earing],
								['Total Take Profit', wallet?.total_take_profit],
								['Total Referral Earn', wallet?.total_level_earning],
								['Global Earn', wallet?.total_global_earing],
								['Current Global Earn', wallet?.current_global_earing],
								['Generation Earn', wallet?.total_generation_earning],
								['Current Generation Earn', wallet?.current_generation_earning],
								['Rank Earn', wallet?.total_rank_earning],
							].map(([label, value], i) => (
								<ListGroup.Item key={i}>
									<span className='flex items-center gap-4'>
										<span>{label}:</span>
										<span className='font-bold'>
											{Number(value).toLocaleString('en-US', {
												style: 'currency',
												currency: 'USD',
											})}
										</span>
									</span>
								</ListGroup.Item>
							))}
						</ListGroup>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserDetails;
