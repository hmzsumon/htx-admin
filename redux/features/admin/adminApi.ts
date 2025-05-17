import { apiSlice } from '../api/apiSlice';
import { setUser, logoutUser } from '../auth/authSlice';

// Assuming you have a defined Transaction type
interface Transaction {
	_id: string;
	description: string;
	amount: number;
	status: string;
	purpose: string;
	createdAt: string;
}

interface TransactionResponse {
	transactions: Transaction[];
	totalTransactions: number;
}
export const adminApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get users from api with typescript
		// getUsers: builder.query<any, void>({
		// 	query: () => '/users',
		// 	providesTags: ['Users'],
		// }),

		// get user by id
		getUserById: builder.query<any, string>({
			query: (id) => `/get-user-details-by-partner-id/${id}`,
		}),

		//admin login
		adminLogin: builder.mutation<any, { email: string; password: string }>({
			query: ({ email, password }) => ({
				url: '/admin/login',
				method: 'POST',
				body: { email, password },
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(setUser(result.data));
				} catch (error) {
					error as any;
				}
			},
		}),

		// admin dashboard data
		getAdminDashboardData: builder.query<any, any>({
			query: () => ({
				url: '/admin-dashboard-data',
				method: 'GET',
			}),
		}),

		//update is_profit status
		updateProfitStatus: builder.mutation<any, any>({
			query: (body) => ({
				url: '/update-profit-status',
				method: 'PUT',
				body: body,
			}),
		}),

		// get transactions by user id
		getTransactionsByUserId: builder.query<
			any,
			{ id: string; page: number; limit: number }
		>({
			query: ({ id, page, limit }) =>
				`/transactions/${id}?page=${page}&limit=${limit}`,
		}),

		// withdraw block api
		withdrawBlock: builder.mutation<any, any>({
			query: (body) => ({
				url: '/withdraw-block',
				method: 'PUT',
				body,
			}),
		}),

		// deposit from admin
		depositFromAdmin: builder.mutation<
			any,
			{ customer_id: string; amount: number }
		>({
			query: ({ customer_id, amount }) => ({
				url: '/deposit-from-admin',
				method: 'POST',
				body: { customer_id, amount },
			}),
		}),

		// find user by customer id
		findUserByPartnerId: builder.mutation<any, any>({
			query: (userId) => ({
				url: `get-user-by-partner-id-for-send/${userId}`,
				method: 'PUT',
			}),
		}),

		// update user fcm token
		updateUserFcmToken: builder.mutation<any, any>({
			query: (body) => ({
				url: '/update-fcm-token',
				method: 'PUT',
				body,
			}),
		}),

		// block user
		blockUser: builder.mutation<any, any>({
			query: (body) => ({
				url: `/block_user`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['User'],
		}),

		// get all manual deposits
		getAllManualDeposits: builder.query<any, any>({
			query: () => ({
				url: '/admin/manual-deposits',
				method: 'GET',
			}),
		}),

		// get live trade profit rate
		getLiveTradeProfitRate: builder.query<any, any>({
			query: () => ({
				url: '/live-trade-profit-rate',
				method: 'GET',
			}),
			providesTags: ['LiveTradeProfitRate'],
		}),

		// Update LiveTrade Profit Rate
		updateLiveTradeProfitRate: builder.mutation<any, any>({
			query: (body) => ({
				url: '/update-live-trade-profit-rate',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['LiveTradeProfitRate'],
		}),

		//create-spin-prize
		createSpinPrize: builder.mutation<any, any>({
			query: (body) => ({
				url: '/create-spin-prize',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Deposit'],
		}),
	}),
});

export const {
	// useGetUsersQuery,
	useGetUserByIdQuery,
	useAdminLoginMutation,
	useGetAdminDashboardDataQuery,
	useUpdateProfitStatusMutation,
	useGetTransactionsByUserIdQuery,
	useWithdrawBlockMutation,
	useDepositFromAdminMutation,
	useFindUserByPartnerIdMutation,
	useUpdateUserFcmTokenMutation,
	useBlockUserMutation,
	useGetAllManualDepositsQuery,
	useGetLiveTradeProfitRateQuery,
	useUpdateLiveTradeProfitRateMutation,
	useCreateSpinPrizeMutation,
} = adminApi;
