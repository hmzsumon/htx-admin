import { apiSlice } from '../api/apiSlice';

export const poolConfigApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get pool config data
		getPoolConfigData: builder.query<any, any>({
			query: () => ({
				url: `/pool-config`,
				method: 'GET',
			}),
			providesTags: ['PoolConfig'],
		}),

		// create pool config
		createPoolConfig: builder.mutation<any, any>({
			query: (data) => ({
				url: `/create-pool-config`,
				method: 'POST',
				body: data,
			}),
		}),

		// update pool config
		updatePoolConfig: builder.mutation<any, any>({
			query: (data) => ({
				url: `/pool-config/update`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['PoolConfig', 'PoolHistory'],
		}),

		// delete pool config
		deletePoolConfig: builder.mutation<any, any>({
			query: (data) => ({
				url: `/delete-pool-config`,
				method: 'POST',
				body: data,
			}),
		}),

		// get pool history
		getPoolHistory: builder.query<any, any>({
			query: () => ({
				url: `/pool-history`,
				method: 'GET',
			}),
			providesTags: ['PoolHistory'],
		}),
	}),
});

export const {
	useGetPoolConfigDataQuery,
	useCreatePoolConfigMutation,
	useUpdatePoolConfigMutation,
	useDeletePoolConfigMutation,
	useLazyGetPoolConfigDataQuery,
	useGetPoolHistoryQuery,
} = poolConfigApi;
