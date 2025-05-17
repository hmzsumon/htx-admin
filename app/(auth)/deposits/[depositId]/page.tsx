'use client';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import CopyToClipboard from '@/lib/CopyToClipboard';
import { useRejectWithdrawMutation } from '@/redux/features/withdraw/withdrawApi';

import {
	Button,
	Card,
	ListGroup,
	Modal,
	TextInput,
	Select,
} from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { useGetDepositByIdQuery } from '@/redux/features/deposit/depositApi';
import { useCreateSpinPrizeMutation } from '@/redux/features/admin/adminApi';

const prizeOptions = [
	'1$',
	'3$',
	'5$',
	'8$',
	'15$',
	'38$',
	'88$',
	'188$',
	'388$',
	'588$',
	'888$',
	'1888$',
	'2888$',
	'5888$',
	'8888$',
];

const SingleDeposit = ({ params }: any) => {
	const router = useRouter();
	const { depositId } = params;
	const { data, isLoading } = useGetDepositByIdQuery(depositId);
	const { deposit } = data || {};
	const [openModal2, setOpenModal2] = useState(false);
	const [reason, setReason] = useState('Transaction Id not matching');
	const [selectedPrize, setSelectedPrize] = useState('');

	const [
		createSpinPrize,
		{
			isLoading: isCreatingPrize,
			isSuccess: isPrizeCreated,
			isError: isPrizeError,
			error: prizeError,
		},
	] = useCreateSpinPrizeMutation();

	const [
		rejectWithdraw,
		{
			isSuccess: r_isSuccess,
			isError: r_isError,
			error: r_error,
			isLoading: r_isLoading,
		},
	] = useRejectWithdrawMutation();

	useEffect(() => {
		if (r_isSuccess) {
			setOpenModal2(false);
			toast.success('Deposit rejected successfully');
		}
		if (r_isError && r_error) {
			toast.error((r_error as fetchBaseQueryError).data?.message);
		}
	}, [r_isSuccess, r_isError]);

	const handlePrizeCreate = async () => {
		if (!selectedPrize || !deposit?.customer_id) {
			toast.error('Select prize and ensure customer ID is present');
			return;
		}
		await createSpinPrize({
			prize: selectedPrize,
			customer_id: deposit.customer_id,
			deposit_id: deposit._id,
		});
	};

	// useEffect
	useEffect(() => {
		if (isPrizeCreated) {
			toast.success('Spin prize created successfully');
		}
		if (isPrizeError && prizeError) {
			toast.error((prizeError as fetchBaseQueryError).data?.message);
		}
	}, [isPrizeCreated, isPrizeError, prizeError]);

	return (
		<div>
			<Card>
				<h3 className='text-center text-xl font-bold mb-4'>Deposit Details</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
					<div>
						<strong>Status:</strong>{' '}
						<span
							className={`${
								deposit?.status === 'approved'
									? 'text-green-500'
									: 'text-orange-500'
							}`}
						>
							{deposit?.status}
						</span>
					</div>
					<div>
						<strong>Approved:</strong>{' '}
						{deposit?.is_approved ? '✅ Yes' : '❌ No'}
					</div>
					<div>
						<strong>Manual:</strong> {deposit?.is_manual ? '✅ Yes' : '❌ No'}
					</div>
					<div>
						<strong>Confirmations:</strong> {deposit?.confirmations}
					</div>
					<div>
						<strong>User ID:</strong> {deposit?.customer_id}
					</div>
					<div>
						<strong>Name:</strong> {deposit?.name}
					</div>
					<div>
						<strong>Email:</strong> {deposit?.email}
					</div>
					<div>
						<strong>Amount:</strong> ${deposit?.amount}
					</div>
					<div>
						<strong>Chain:</strong> {deposit?.chain}
					</div>
					<div>
						<strong>TX ID:</strong>{' '}
						<span className='flex gap-1 items-center'>
							{deposit?.txId} <CopyToClipboard text={deposit?.txId} />
						</span>
					</div>
					<div>
						<strong>Created:</strong>{' '}
						{new Date(deposit?.createdAt).toLocaleString()}
					</div>
					<div>
						<strong>Updated:</strong>{' '}
						{new Date(deposit?.updatedAt).toLocaleString()}
					</div>
					<div>
						<strong>Order ID:</strong> {deposit?.order_id}
					</div>
					<div>
						<strong>Mongo ID:</strong>{' '}
						<span className='text-gray-500'>{deposit?._id}</span>
					</div>
					<div>
						<strong>Spin Amount:</strong>{' '}
						<span className='text-gray-500'>{deposit?.spin_amount}$</span>
					</div>
				</div>
				<div className='mt-4'>
					<label className='block mb-2 text-sm font-medium'>Select Prize</label>
					<Select
						required
						onChange={(e) => setSelectedPrize(e.target.value)}
						defaultValue=''
					>
						<option value='' disabled>
							Select Prize
						</option>
						{prizeOptions.map((option, index) => (
							<option key={index} value={option}>
								{option}
							</option>
						))}
					</Select>
					<Button
						className='mt-2'
						onClick={handlePrizeCreate}
						isProcessing={isCreatingPrize}
						disabled={isCreatingPrize || deposit?.is_free_spin}
					>
						Create Spin Prize
					</Button>
				</div>
			</Card>

			<Modal show={openModal2} onClose={() => setOpenModal2(false)}>
				<Modal.Header>Reject Withdraw!</Modal.Header>
				{r_isLoading ? (
					<div className='flex justify-center items-center p-4'>
						<PulseLoader color='#FFD700' loading={true} size={10} />
					</div>
				) : (
					<Modal.Body>
						<p className='text-yellow-500'>
							Are you sure you want to reject this withdraw?
						</p>
						<div className='my-4'>
							<label htmlFor='rejection-reasons' className='block mb-2'>
								Reason for rejection
							</label>
							<TextInput
								type='text'
								required
								value={reason}
								onChange={(e) => setReason(e.target.value)}
							/>
						</div>
					</Modal.Body>
				)}
				<Modal.Footer>
					<Button onClick={() => rejectWithdraw({ id: deposit?._id, reason })}>
						Reject Withdraw
					</Button>
					<Button color='gray' onClick={() => setOpenModal2(false)}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default SingleDeposit;
