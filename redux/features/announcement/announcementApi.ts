import { apiSlice } from '../api/apiSlice';

export const announcementApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get active announcements
		getActiveAnnouncements: builder.query<any, void>({
			query: () => ({
				url: '/active-announcement',
				method: 'GET',
			}),
		}),

		// get all announcements
		getAllAnnouncements: builder.query<any, void>({
			query: () => ({
				url: '/all-announcements',
				method: 'GET',
			}),
			providesTags: ['Announcement'],
		}),

		// update announcement
		updateAnnouncement: builder.mutation({
			query: ({ id, data }) => ({
				url: `/update-announcement/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Announcement'],
		}),
	}),
});

export const {
	useGetActiveAnnouncementsQuery,
	useGetAllAnnouncementsQuery,
	useUpdateAnnouncementMutation,
} = announcementApi;
