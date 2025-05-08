'use client';

import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const symbols = [
	'BTCUSDT',
	'ETHUSDT',
	'BNBUSDT',
	'SOLUSDT',
	'TRUMPUSDT',
	'LTCUSDT',
];

const MentorSignalPanel = () => {
	const [form, setForm] = useState({
		period: '',
		symbol: 'BTCUSDT',

		t_type: 'UP',
		amount: '',
		result: '',
	});

	const [signals, setSignals] = useState<any[]>([]);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [session, setSession] = useState('1st Session');
	const componentRef = useRef<HTMLDivElement>(null);

	const currentDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		day: '2-digit',
		month: 'long',
	});

	const storageKey = `mentor_signals_${session}`;

	useEffect(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			setSignals(JSON.parse(saved));
		} else {
			setSignals([]);
		}
	}, [session]);

	const handleAddSignal = () => {
		if (!form.period || !form.amount) return alert('Period & Amount required!');
		const newSignals = [...signals, { ...form }];
		setSignals(newSignals);
		localStorage.setItem(storageKey, JSON.stringify(newSignals));
		setForm({
			period: '',
			symbol: 'BTCUSDT',
			t_type: 'UP',
			amount: '',
			result: '',
		});
	};

	const handleSetResult = (result: string) => {
		if (selectedIndex === null) return;
		const updated = [...signals];
		updated[selectedIndex].result = result;
		setSignals(updated);
		localStorage.setItem(storageKey, JSON.stringify(updated));
		setSelectedIndex(null);
	};

	const handleScreenshot = async () => {
		if (!componentRef.current) return;
		const canvas = await html2canvas(componentRef.current);
		const image = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = image;
		link.download = `mentor_signal_${session}.png`;
		link.click();
	};

	const handleClearSession = () => {
		localStorage.removeItem(storageKey);
		setSignals([]);
		alert(`${session} data cleared!`);
	};

	// ✅ Updated cellClass for perfect centering and spacing
	const cellClass =
		'border h-[48px] px-1 text-xs text-center align-middle flex items-center justify-center font-medium';

	return (
		<div className='p-2 space-y-4 w-7/12 mx-auto'>
			<h2 className='text-xl font-bold text-center'>HTX TRADE SIGNAL PANEL</h2>

			{/* Form */}
			<div className='grid grid-cols-5 gap-2 items-center'>
				<input
					type='text'
					placeholder='Issue ID'
					value={form.period}
					onChange={(e) => setForm({ ...form, period: e.target.value })}
					className='border rounded px-2 py-1 text-center'
				/>
				<select
					value={form.symbol}
					onChange={(e) => setForm({ ...form, symbol: e.target.value })}
					className='border rounded px-2 py-1 text-center'
				>
					{symbols.map((sym) => (
						<option key={sym} value={sym}>
							{sym}
						</option>
					))}
				</select>
				<select
					value={form.t_type}
					onChange={(e) => setForm({ ...form, t_type: e.target.value })}
					className='border rounded px-2 py-1 text-center'
				>
					<option value='UP'>UP</option>
					<option value='DOWN'>DOWN</option>
					<option value='SIDEWAYS'>SIDEWAYS</option>
				</select>
				<input
					type='number'
					placeholder='Amount'
					value={form.amount}
					onChange={(e) => setForm({ ...form, amount: e.target.value })}
					className='border rounded px-2 py-1 text-center'
				/>
				<button
					onClick={handleAddSignal}
					className='bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700'
				>
					➕ Add
				</button>
			</div>

			{/* Session Selector */}
			<div className='flex items-center gap-2'>
				<label className='font-semibold'>Session:</label>
				<select
					value={session}
					onChange={(e) => setSession(e.target.value)}
					className='border rounded px-2 py-1'
				>
					<option>1st Session</option>
					<option>2nd Session</option>
					<option>3rd Session</option>
					<option>4th Session</option>
					<option>5th Session</option>
				</select>
				<button
					onClick={handleClearSession}
					className='ml-2 text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
				>
					🗑 Clear This Session
				</button>
			</div>

			{/* Result Set Dropdown */}
			{selectedIndex !== null && (
				<div className='flex items-center gap-3'>
					<span className='font-medium'>
						Set result for Issue {signals[selectedIndex]?.period}:
					</span>
					<select
						onChange={(e) => handleSetResult(e.target.value)}
						defaultValue=''
						className='border rounded px-2 py-1'
					>
						<option value=''>Select</option>
						<option value='WIN'>WIN</option>
						<option value='LOSS'>LOSS</option>
					</select>
				</div>
			)}

			{/* Screenshot Button */}
			<div>
				<button
					onClick={handleScreenshot}
					className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
				>
					📸 Take Screenshot
				</button>
			</div>

			{/* Signal Table */}
			<div
				ref={componentRef}
				className='bg-white shadow rounded overflow-hidden max-w-md mx-auto pb-4'
			>
				<div className='bg-blue-400 text-white font-bold text-center py-2 text-lg'>
					HTX TRADE SIGNAL !!!
				</div>
				<div className='grid grid-cols-3 text-center bg-[#c3e8fd] font-semibold text-sm text-black'>
					<div className={cellClass}>{currentDate.toUpperCase()}</div>
					<div className={cellClass}>{session.toUpperCase()}</div>
					<div className={cellClass}>TRADER ORI</div>
				</div>
				<div className='grid grid-cols-5 bg-gray-100 font-bold '>
					<div className={cellClass}>ISSUE ID</div>
					<div className={cellClass}>SYMBOL</div>
					<div className={cellClass}>T-TYPE</div>
					<div className={cellClass}>AMOUNT</div>
					<div className={cellClass}>RESULT</div>
				</div>
				{signals.map((item, index) => (
					<div
						key={index}
						className='grid grid-cols-5 text-center text-sm hover:bg-gray-50 cursor-pointer'
						onClick={() => setSelectedIndex(index)}
					>
						<div className={cellClass}>{item.period}</div>
						<div className={cellClass}>{item.symbol}</div>
						<div
							className={`${cellClass} font-semibold ${
								item.t_type === 'UP'
									? 'text-green-600'
									: item.t_type === 'DOWN'
									? 'text-blue-600'
									: 'text-gray-600'
							}`}
						>
							{item.t_type}
						</div>
						<div className={cellClass}>{item.amount}$</div>
						<div className={`${cellClass} font-semibold`}>
							{item.result ? (
								<span
									className={
										item.result === 'LOSS' ? 'text-red-600' : 'text-green-500'
									}
								>
									{item.result}
								</span>
							) : (
								''
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default MentorSignalPanel;
