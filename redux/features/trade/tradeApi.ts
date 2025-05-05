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

		//get 3m trade data
		getThreeMTradeData: builder.query<any, any>({
			query: () => ({
				url: `/signalTrade/3m-activeTradeRound`,
				method: 'GET',
			}),
		}),

		//get 3m trade data by period
		getTradeRoundsByPeriod: builder.query({
			query: (period) => ({
				url: `/signalTrade/${period}`,
				method: 'GET',
			}),
		}),

		// get signal trade data by symbol and issueId
		getSignalTradeDataBySymbolAndIssueId: builder.query({
			query: ({ symbol, issueId }) => ({
				url: `/signalTrade/${symbol}/${issueId}`,
				method: 'GET',
			}),
		}),

		// get /signalTrade/config
		getSignalTradeConfig: builder.query({
			query: () => ({
				url: `/signalTrade-config`,
				method: 'GET',
			}),
			providesTags: ['SignalTradeConfig'],
		}),

		// signalTrade/declareManualResult
		declareManualResult: builder.mutation({
			query: (data) => ({
				url: `/signalTrade/declareManualResult`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['SignalTradeConfig'],
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
	useGetThreeMTradeDataQuery,
	useGetTradeRoundsByPeriodQuery,
	useGetSignalTradeDataBySymbolAndIssueIdQuery,
	useGetSignalTradeConfigQuery,
	useDeclareManualResultMutation,
} = tradeApi;
