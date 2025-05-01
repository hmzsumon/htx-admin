import { apiSlice } from '../api/apiSlice';

export const tradeApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get trade data
		getTradeData: builder.query<any, any>({
			query: () => ({
				url: `/dashboard-trade-data`,
				method: 'GET',
			}),
		}),

		// get trade users
		getTradeUsers: builder.query<any, any>({
			query: () => ({
				url: `/trade-users`,
				method: 'GET',
			}),
		}),

		// create live trade
		createLiveTrade: builder.mutation<any, any>({
			query: (data) => ({
				url: `/create-new-live-trade`,
				method: 'POST',
				body: data,
			}),
		}),

		// get live trade for admin

		getLiveTradeForAdmin: builder.query<any, any>({
			query: () => ({
				url: `/upcoming-live-trade-for-admin`,
				method: 'GET',
			}),
			providesTags: ['LiveTrade'],
		}),

		//update live trade to active
		updateLiveTradeToActive: builder.mutation<any, any>({
			query: (data) => ({
				url: `/update-live-trade-to-active`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['LiveTrade'],
		}),

		// end Live trade for admin
		endLiveTrade: builder.mutation<any, any>({
			query: (data) => ({
				url: `/end-live-trade`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['LiveTrade'],
		}),

		//trigger-forced-loss-by-package
		triggerForcedLossByPackage: builder.mutation<any, any>({
			query: (data) => ({
				url: `/trigger-forced-loss-by-package`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['LiveTrade'],
		}),

		// trigger-forced-profit-by-package
		triggerForcedProfitByPackage: builder.mutation<any, any>({
			query: (data) => ({
				url: `/trigger-forced-profit-by-package`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['LiveTrade'],
		}),
	}),
});

export const {
	useGetTradeDataQuery,
	useGetTradeUsersQuery,
	useCreateLiveTradeMutation,
	useGetLiveTradeForAdminQuery,
	useUpdateLiveTradeToActiveMutation,
	useEndLiveTradeMutation,
	useTriggerForcedLossByPackageMutation,
	useTriggerForcedProfitByPackageMutation,
} = tradeApi;
