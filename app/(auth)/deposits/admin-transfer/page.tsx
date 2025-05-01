'use client';
import React, { use, useEffect } from 'react';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { CiSearch } from 'react-icons/ci';
import {
	useDepositFromAdminMutation,
	useFindUserByPartnerIdMutation,
	useGetUserByIdQuery,
} from '@/redux/features/admin/adminApi';

const AdminTransfer = () => {
	const [
		depositFromAdmin,
		{
			isSuccess: d_isSuccess,
			isError: d_isError,
			error: d_error,
			isLoading: d_isLoading,
		},
	] = useDepositFromAdminMutation();

	const [customer_id, setCustomerId] = React.useState('');
	const [fetchData, setFetchData] = React.useState(false);
	const [amount, setAmount] = React.useState(0);
	const [is_user, setIsUser] = React.useState(false);
	const [finUserError, setFinUserError] = React.useState(false);

	const [findUserByPartnerId, { data, error, isLoading, isError, isSuccess }] =
		useFindUserByPartnerIdMutation();

	const { user } = data || {};

	const handleInputChange = (e: any) => {
		setCustomerId(e.target.value);
		setFinUserError(false);
		setIsUser(false);
	};

	const handleSearchClick = (e: any) => {
		e.preventDefault();
		findUserByPartnerId(customer_id); // Prevent form submission
		if (customer_id) {
			setFetchData(true); // Set the flag to true to trigger the fetch
		}
	};

	useEffect(() => {
		if (isError && error) {
			toast.error((error as fetchBaseQueryError).data?.message);
			setFinUserError(true);
			setIsUser(false);
		}
		if (isSuccess && user) {
			setFinUserError(false);
			setIsUser(true);
		}
	}, [isError, error, isSuccess, user]);

	const handleChangeAmount = (e: any) => {
		setAmount(e.target.value);
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		console.log('Submit');
		const data = {
			customer_id,
			amount,
		};
		depositFromAdmin(data);
	};

	// useEffect to show toast on success
	useEffect(() => {
		if (d_isSuccess) {
			toast.success('Fund transfer success');
			// reset the form
			setCustomerId('');
			setIsUser(false);
			setAmount(0);
		}

		if (d_isError && d_error) {
			toast.error((d_error as fetchBaseQueryError).data?.message);
		}
	}, [d_isSuccess, d_isError, d_error]);

	return (
		<div>
			<Card>
				<div className='mb-4'>
					<h2 className='text-2xl font-bold text-center'>
						Fund Transfer To User
					</h2>
				</div>
				<form
					className='flex max-w-md flex-col gap-4 mx-auto w-full'
					onSubmit={handleSubmit}
				>
					<div className=''>
						<div className='mb-2 block'>
							<Label htmlFor='customer_id' value='Enter User Id' />
						</div>
						<div className='flex w-full '>
							<TextInput
								style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
								className='flex-1'
								id='customer_id'
								type='text'
								placeholder='Enter User ID'
								value={customer_id}
								onChange={handleInputChange}
								required
							/>
							<button
								className='cursor-pointer  flex items-center justify-center w-fit px-4  bg-teal-600 hover:bg-teal-700 transition-all  rounded-r-md group'
								onClick={handleSearchClick}
							>
								<CiSearch className='text-gray-100 text-xl font-bold transition-transform group-hover:scale-125' />
							</button>
						</div>
						{finUserError && (
							<small className='text-red-500'>Agent not found</small>
						)}
					</div>
					{/* Start Show User INfo */}
					{is_user && (
						<>
							<Card>
								<p>Customer Name: {user?.name}</p>
								<p>Customer Email: {user?.email}</p>
								<p>Partner Id: {user?.customer_id}</p>
							</Card>

							<div>
								<div className='mb-2 block'>
									<Label htmlFor='amount' value='Amount' />
								</div>
								<TextInput
									id='amount'
									type='number'
									required
									value={amount}
									onChange={handleChangeAmount}
								/>
							</div>

							<Button type='submit'>Submit</Button>
						</>
					)}
				</form>
			</Card>
		</div>
	);
};

export default AdminTransfer;
