'use client';

import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import ItemCard from '@/components/Dashboard/ItemCard';
import {
	useGetAdminDashboardDataQuery,
	useUpdateProfitStatusMutation,
	useUpdateUserFcmTokenMutation,
} from '@/redux/features/admin/adminApi';
import { Card } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { GiReceiveMoney } from 'react-icons/gi';
import { FaWallet, FaUsers } from 'react-icons/fa';
import { CiInboxOut } from 'react-icons/ci';
import { requestForToken } from '@/utils/firebase';
import { useSelector } from 'react-redux';

const Dashboard = () => {
	const { user } = useSelector((state: any) => state.auth);
	const { data, isLoading } = useGetAdminDashboardDataQuery(undefined);
	const { company } = data || {};
	const [status, setStatus] = useState(company?.is_profit);
	const [updateUserFcmToken, { isLoading: updatingFcmToken }] =
		useUpdateUserFcmTokenMutation();

	const requestNotificationPermission = async () => {
		const permission = await window.Notification.requestPermission();
		if (permission === 'granted') {
			handleGetToken();
		} else if (permission === 'denied') {
			console.log('Notification permission denied');
		}
	};

	const handleGetToken = async () => {
		const token = await requestForToken();
		const existingTokens = user?.fcm_tokens || [];
		if (!existingTokens.includes(token)) {
			console.log(
				'FCM Token does not exist, updating...',
				!existingTokens.includes(token)
			);
			await updateUserFcmToken({ fcm_tokens: [...existingTokens, token] });
		} else {
			console.log('FCM Token already exists, no update needed.');
		}
	};

	const [
		updateProfitStatus,
		{ isLoading: updating, isError, isSuccess, error },
	] = useUpdateProfitStatusMutation();

	useEffect(() => {
		setStatus(company?.is_profit);
	}, [company]);

	const updateHandler = async () => {
		try {
			await updateProfitStatus({ is_profit: !status }).unwrap();
			setStatus((prevStatus: any) => !prevStatus);
		} catch (error) {
			console.error('Failed to update profit status', error);
		}
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success('Update successfully');
		}

		if (isError) {
			if (isError && error) {
				toast.error((error as fetchBaseQueryError).data?.message);
			}
		}
	}, [isSuccess, isError, error]);

	useEffect(() => {
		requestNotificationPermission();
	}, []);

	return (
		<div className='z-0 px-2'>
			<div className='py-4'>
				<div className='my-6 grid md:grid-cols-2 gap-4'>
					<ItemCard
						icon={<GiReceiveMoney />}
						title='Total Deposit'
						balance={company?.deposit?.total_deposit_amount}
						is_balance={true}
					/>

					<ItemCard
						icon={<FaWallet />}
						title='Today Deposit'
						balance={company?.deposit?.today_deposit_amount}
						is_balance={true}
					/>

					<ItemCard
						icon={<FaWallet />}
						title='Today Admin Deposit'
						balance={company?.deposit?.today_admin_deposit_amount}
						is_balance={true}
					/>
					<ItemCard
						icon={<CiInboxOut />}
						title='Total Withdraw'
						balance={company?.withdraw?.total_withdraw_amount}
						is_balance={true}
					/>
					<ItemCard
						icon={<CiInboxOut />}
						title='Today Withdraw (Net Amount)'
						balance={company?.withdraw?.today_withdraw_net_amount}
						is_balance={true}
					/>

					<ItemCard
						icon={<FaUsers />}
						title='Total Users'
						balance={company?.users.total_users}
						is_balance={false}
					/>
					<ItemCard
						icon={<FaUsers />}
						title='Total Active Users'
						balance={company?.users?.total_active_users}
						is_balance={false}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
