'use client';

import { TickIcon } from '@/lib/icons/CommonIcons';
import {
	useGetPackageByIdForAdminQuery,
	useUpdatePackageByIdForAdminMutation,
} from '@/redux/features/package/packageApi';
import { fetchBaseQueryError } from '@/redux/services/helpers';
import { Package } from '@/types/types';
import { Card, Spinner } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { toast } from 'react-toastify';
import { FaEdit, FaCheck } from 'react-icons/fa';

const PackageDetails = ({ params }: any) => {
	const router = useRouter();
	const packageId = params.packageId;

	// Fetch package details
	const { data, isLoading, isError, isSuccess, error } =
		useGetPackageByIdForAdminQuery(packageId);
	const { package: packageData } = data || { package: {} };

	const [sPackage, setSPackage] = useState<Package | null>(null);

	const [editField, setEditField] = useState(null);
	const [updatedValue, setUpdatedValue] = useState('');

	// Handle Edit Click
	const handleEditClick = (key: any, value: any) => {
		setEditField(key);
		setUpdatedValue(value);
	};

	useEffect(() => {
		if (isSuccess) setSPackage(packageData);
		if (isError) {
			toast.error((error as fetchBaseQueryError).data?.message);
			setSPackage(null);
		}
	}, [isSuccess, packageData, isError, error]);

	// Create package mutation
	const [
		updatePackageByIdForAdmin,
		{
			isLoading: isUpdating,
			isError: isUpdatingError,
			isSuccess: isUpdatingSuccess,
			error: updatingError,
		},
	] = useUpdatePackageByIdForAdminMutation();

	// Handle save click
	const handleSaveClick = async (key: any, value: any) => {
		console.log('key', key, 'value', value);
		try {
			const formattedKey = key.includes(' ')
				? key.toLowerCase().replace(/\s+/g, '_')
				: key.toLowerCase();

			await updatePackageByIdForAdmin({
				id: packageId,
				data: { updateData: { [formattedKey]: value } },
			});
		} catch (error) {
			toast.error('Failed to update package');
			console.error('Update Error:', error);
		}
	};

	// Handle create package effects
	useEffect(() => {
		if (isUpdatingSuccess) {
			toast.success('Package created successfully');
			setEditField(null);
		}
		if (isUpdatingError) {
			toast.error((updatingError as fetchBaseQueryError).data?.message);
		}
	}, [isUpdatingSuccess, isUpdatingError, updatingError, router]);

	if (isLoading || sPackage === null) {
		return (
			<div className='text-center flex items-center justify-center h-[60vh]'>
				<Spinner aria-label='Loading' size='xl' />
			</div>
		);
	}

	const packageDetails = Object.entries(sPackage)
		.filter(([key, value]) => value !== null && value !== undefined) // null বা undefined বাদ দেবে
		.map(([key, value], index) => ({
			id: `${key}-${index}`, // ইউনিক আইডি তৈরি করা (key + index)
			label: key
				.replace(/_/g, ' ')
				.replace(/\b\w/g, (char) => char.toUpperCase()),
			value: typeof value === 'number' ? value.toLocaleString() : value,
		}));

	return (
		<div className='tracking-tight text-gray-700 w-full md:w-6/12 mx-auto'>
			<h2 className='text-xl font-medium text-gray-700 my-4'>
				Your selected package is:
				<span className='text-2xl font-semibold'>{sPackage.title}</span>
			</h2>
			<Card className='w-full'>
				<h5 className='text-xl font-semibold text-center'>{sPackage.title}</h5>
				<div className='flex items-baseline gap-1'>
					<span className='text-2xl font-extrabold'>
						{Number(sPackage.price).toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
					<span>USDT</span>
				</div>
				<ul className='my-4 space-y-4'>
					{packageDetails.map((detail) => (
						<li key={detail.id} className='flex items-center space-x-3'>
							<TickIcon />
							{editField === detail.label ? (
								<input
									type='text'
									className='border px-2 py-1 rounded-md'
									value={updatedValue}
									onChange={(e) => setUpdatedValue(e.target.value)}
								/>
							) : (
								<span>
									{detail.label} - {detail.value}
								</span>
							)}

							{editField === detail.label ? (
								<FaCheck
									className='text-green-500 cursor-pointer'
									onClick={() => handleSaveClick(editField, updatedValue)}
								/>
							) : (
								<FaEdit
									className='text-blue-500 cursor-pointer'
									onClick={() => handleEditClick(detail.label, detail.value)}
								/>
							)}
						</li>
					))}
				</ul>
				{/* <button
					type='button'
					className='w-full rounded-lg bg-icm-green px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700'
				>
					{isUpdating ? (
						<PulseLoader color='#fff' size={8} margin={2} />
					) : (
						'Update Now'
					)}
				</button> */}
				<Link href='/packages'>
					<button
						type='button'
						className='w-full rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600'
					>
						Change Plan
					</button>
				</Link>
			</Card>
		</div>
	);
};

export default PackageDetails;
