import { apiSlice } from "../api/apiSlice";

type BoosterUpdateBody = Partial<{
  boost_percentage: number; // accept decimal (0–1) or percent (0–100) – backend will normalize
  booster_bonus: number; // same as above
}>;

export const boosterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── Route to get booster config ────────── */
    getBoosterConfig: builder.query<any, void>({
      query: () => ({
        url: `/admin/booster/config`,
        method: "GET",
      }),
      providesTags: ["Booster"],
    }),

    /* ────────── edit booster config (partial) ────────── */
    updateBoosterConfig: builder.mutation<any, BoosterUpdateBody>({
      query: (data) => ({
        url: `/admin/booster/config/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Booster"],
    }),

    /* ────────── Route to distribute booster profit  ────────── */
    distributeBoosterProfit: builder.mutation<any, void>({
      query: () => ({
        url: `/booster/profit/distribute`,
        method: "POST",
      }),
      invalidatesTags: ["Booster"],
    }),
  }),
});

export const {
  useGetBoosterConfigQuery,
  useUpdateBoosterConfigMutation,
  useDistributeBoosterProfitMutation,
} = boosterApi;
