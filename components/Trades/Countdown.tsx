'use client';

import React, { useEffect, useState } from 'react';

interface CountdownProps {
	endTime: string; // ISO string or timestamp from server
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date().getTime();
			const end = new Date(endTime).getTime();
			const diff = end - now;
			setTimeLeft(diff > 0 ? diff : 0);
		}, 1000);

		return () => clearInterval(interval);
	}, [endTime]);

	const formatTime = (ms: number) => {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
			2,
			'0'
		)}`;
	};

	return (
		<span className='font-bold'>
			<span>Countdown: </span>
			<span className='text-red-500'>
				{timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
			</span>
		</span>
	);
};

export default Countdown;
