'use client';
import React from 'react';

import { Package } from '@/types/types';
import Link from 'next/link';

const PricingCard = ({ pac }: any) => {
	return (
		<div>
			<div className='w-full mx-auto overflow-hidden bg-white rounded-lg shadow-lg'>
				<div className='px-6 py-4 bg-gradient-to-r from-green-500 to-icm-green'>
					<h2 className='text-2xl font-semibold text-white'>{pac?.title}</h2>
					<p className='text-gray-200'>{pac?.sub_title}</p>
				</div>
				<div className='px-6 py-4'>
					<div className='text-4xl font-bold text-gray-800'>${pac?.price}</div>
					{/* <p className='text-gray-600'>Billed annually</p> */}
				</div>
				<div className='px-6 py-4'>
					<ul className='text-gray-600'>
						<li className='flex items-center'>
							<svg
								className='w-4 h-4 mr-2 text-green-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								></path>
							</svg>
							<span className='text-base font-normal leading-tight text-gray-700 dark:text-gray-400'>
								Profit/Day - {pac?.profit_day}
							</span>
						</li>
						<li className='flex items-center'>
							<svg
								className='w-4 h-4 mr-2 text-green-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								></path>
							</svg>
							<span className='text-base font-normal leading-tigh700 dark:text-gray-400'>
								Weekly - Five days
							</span>
						</li>
						<li className='flex items-center'>
							<svg
								className='w-4 h-4 mr-2 text-green-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								></path>
							</svg>
							<span className='text-base font-normal leading-tigh700 dark:text-gray-400'>
								Return - {pac?.return}
							</span>
						</li>
						<li className='flex items-center'>
							<svg
								className='w-4 h-4 mr-2 text-green-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								></path>
							</svg>
							<span className='text-base font-normal leading-tigh700 dark:text-gray-400'>
								Total Return - ${pac?.total_return}
							</span>
						</li>
					</ul>
				</div>
				<div className='px-6 pt-4 pb-6'>
					<Link
						href={`/packages/${pac?._id}`}
						passHref
						className='block w-full px-4 py-2 font-semibold text-center text-white bg-green-500 rounded hover:bg-icm-green focus:bg-indigo-700 focus:outline-none'
					>
						Update
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PricingCard;
