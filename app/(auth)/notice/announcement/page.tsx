'use client';
import React, { useState } from 'react';
import {
	useGetAllAnnouncementsQuery,
	useUpdateAnnouncementMutation,
} from '@/redux/features/announcement/announcementApi';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';

interface AnnouncementItem {
	_id: string;
	message: string;
	type?: string;
	is_active: boolean;
}

const Announcement = () => {
	const { data, isLoading, isError } = useGetAllAnnouncementsQuery();
	const [editId, setEditId] = useState<string | null>(null);
	const [editedMessage, setEditedMessage] = useState('');
	const [editedType, setEditedType] = useState('info');

	const [updateAnnouncement, { isLoading: isUpdating }] =
		useUpdateAnnouncementMutation();

	const handleEditClick = (item: AnnouncementItem) => {
		// Toggle behavior
		if (editId === item._id) {
			setEditId(null);
			setEditedMessage('');
			setEditedType('info');
		} else {
			setEditId(item._id);
			setEditedMessage(item.message);
			setEditedType(item.type || 'info');
		}
	};

	const handleSave = async () => {
		try {
			await updateAnnouncement({
				id: editId,
				data: { message: editedMessage, type: editedType },
			}).unwrap();
			toast.success(' Announcement updated successfully');
			setEditId(null);
		} catch (err: any) {
			const msg = err?.data?.error || 'Failed to update announcement';
			toast.error(`❌ ${msg}`);
		}
	};

	if (isLoading) return <p>Loading announcements...</p>;
	if (isError) return <p>Failed to load announcements</p>;

	const announcements: AnnouncementItem[] = data?.announcements || [];

	return (
		<div className='p-4 w-full mx-auto'>
			<h1 className='text-xl font-bold mb-4 flex items-center gap-2'>
				<span className='text-pink-500 text-2xl'>📢</span> Manage Announcements
			</h1>

			<div className='space-y-6'>
				{announcements.map((item) => (
					<div
						key={item._id}
						className={`rounded-lg p-4 shadow-md relative transition-all duration-300 ${
							item.is_active
								? 'bg-green-100 border-l-4 border-green-500 text-green-800'
								: 'bg-gray-100 border-l-4 border-gray-400 text-gray-600'
						}`}
					>
						<div className=' flex flex-col gap-2'>
							{/* Toggleable Edit Panel */}
							{editId === item._id ? (
								<div className='space-y-2'>
									<textarea
										className='w-full border rounded p-2 text-sm min-h-[120px] resize-y'
										value={editedMessage}
										onChange={(e) => setEditedMessage(e.target.value)}
									/>
									<div className='flex gap-5 items-center'>
										<select
											className='border p-2 rounded text-sm'
											value={editedType}
											onChange={(e) => setEditedType(e.target.value)}
										>
											<option value='info'>Info</option>
											<option value='warning'>Warning</option>
											<option value='alert'>Alert</option>
										</select>
										<button
											disabled={isUpdating}
											className='bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50'
											onClick={handleSave}
										>
											{isUpdating ? 'Saving...' : 'Save & Activate'}
										</button>
									</div>
								</div>
							) : (
								<>
									<p className='text-sm font-medium'>{item.message}</p>
									<p className='text-xs mt-1'>
										Status: {item.is_active ? '🟢 Active' : '⚪ Inactive'}
									</p>
									<p className='text-xs'>Type: {item.type}</p>
								</>
							)}

							{/* Edit Icon Bottom Right */}
							<div className='absolute bottom-1 right-3'>
								<button
									className='text-gray-500 hover:text-blue-600 text-sm flex items-center gap-1'
									onClick={() => handleEditClick(item)}
								>
									<FaEdit /> <span>Edit</span>
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Announcement;
