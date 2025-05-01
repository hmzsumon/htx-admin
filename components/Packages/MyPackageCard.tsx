'use client';
import React from 'react';
import { GiReceiveMoney } from 'react-icons/gi';
import { MyPackage } from '@/types/types';
import Link from 'next/link';
import { Card } from 'flowbite-react';
import {
	formatBalance,
	formatDate,
	formDateWithDayMonthTime,
} from '@/lib/functions';
interface MyPackageCardProps {
	pac: MyPackage;
}

const MyPackageCard: React.FC<MyPackageCardProps> = ({ pac }) => {
	return (
		<div>
			<div className='w-full mx-auto overflow-hidden bg-white rounded-lg shadow-lg'>
				<div className='px-6 py-4 bg-gradient-to-r from-green-500 to-icm-green'>
					<h2 className='text-2xl font-semibold text-white'>{pac?.p_title}</h2>
					<p className='text-gray-200 text-xs'>{pac?.sub_title}</p>
				</div>
				<div className='px-6 py-4'>
					<div className='text-4xl font-bold text-gray-800 text-center'>
						${pac?.p_price}
					</div>
					{/* <p className='text-gray-600'>Billed annually</p> */}
				</div>
				<div className='px-6 py-4 flex flex-col md:flex-row items-center gap-10'>
					<ul className='text-gray-600 order-2 md:order-1 text-sm'>
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
							<span className=' font-normal leading-tight text-gray-700 dark:text-gray-400'>
								Profit/Day -{' '}
								<span className='text-sm font-bold'>
									{formatBalance(pac?.to_day_profit || 0)} USDT
								</span>
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
							<span className=' font-normal leading-tigh700 dark:text-gray-400'>
								Weekly - <span className='text-sm font-bold'>Five days</span>
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
							<span className=' font-normal leading-tigh700 dark:text-gray-400'>
								Return - {''}
								<span className='text-sm font-bold'>{pac?.return}</span>
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
							<span className=' font-normal leading-tigh700 dark:text-gray-400'>
								Total Return -{' '}
								<span className='text-sm font-bold'>${pac?.p_return}</span>
							</span>
						</li>
						{pac?.is_expired && (
							<>
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
									<span className=' font-normal leading-tigh700 dark:text-gray-400'>
										Expired on -{' '}
										<span className='text-xs font-bold'>
											{formatDate(pac?.expire_date)}
										</span>
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
									<span className=' font-normal leading-tigh700 dark:text-gray-400'>
										Duration:{' '}
										<span className='text-sm font-bold'>
											{pac?.p_duration} days
										</span>
									</span>
								</li>
							</>
						)}
					</ul>
					{/* icon */}
					<div className=' order-1 md:order-2 flex gap-4 items-center'>
						<Card className=' w-20 h-20 rounded-full  flex items-center justify-center'>
							<GiReceiveMoney className=' text-icm-green text-3xl' />
						</Card>
						<div>
							<p>
								<span className='font-normal leading-tigh700 dark:text-gray-400'></span>
								Total Profit
							</p>
							<p className='uppercase md:mb-0 mb-5 text-lg text-slate-600'>
								<span className='font-semibold text-xl text-black'>
									{formatBalance(pac?.profit || 0)}
								</span>{' '}
								USDT
							</p>
						</div>
					</div>
				</div>
				<div className='px-6 pt-4 pb-6'>
					<button
						disabled
						className='block w-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 font-semibold text-center text-white bg-green-500 rounded hover:bg-icm-green focus:bg-indigo-700 focus:outline-none'
					>
						{pac?.is_expired ? 'Complete' : 'Active'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default MyPackageCard;
