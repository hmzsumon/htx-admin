'use client';
import React, { useState } from 'react';
import { Spinner } from 'flowbite-react';
import {
	useCreatePackageMutation,
	useGetAllPackagesQuery,
} from '@/redux/features/package/packageApi';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import PricingCard from '@/components/Packages/PricingCard';

import { Package } from '@/types/types';
const Investment = () => {
	const { data, error, isLoading, isSuccess, isError } =
		useGetAllPackagesQuery(undefined);

	const { user } = useSelector((state: any) => state.auth);

	const { packages } = data || { packages: [] };

	return (
		<>
			{isLoading ? (
				<div className='text-center flex items-center justify-center h-[60vh]'>
					<Spinner aria-label='Center-aligned spinner example' size='xl' />
				</div>
			) : (
				<div className=' p-4 tracking-tight text-gray-700'>
					<h2 className=' my-4 text-2xl md:text-4xl  font-semibold text-gray-700  '>
						<span className=''>Investment Plans</span>
					</h2>
					<div className=' '>
						<div className='grid gap-6 grid-cols-1 md:grid-cols-2 '>
							{packages.map((p: Package) => (
								<PricingCard pac={p} key={p._id} />
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Investment;
