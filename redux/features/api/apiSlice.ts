import baseUrl from "@/config/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = `${baseUrl}/api/v1`;

console.log("baseUrl", baseUrl);
export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: url,
    // Introduce an artificial delay using `setTimeout`
    prepareHeaders: async (headers, { getState, endpoint }: any) => {
      const token = getState()?.auth?.token;
      // console.log('token', token);
      if (token) {
        headers.set("token", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Admin",
    "Pxc",
    "Wallet",
    "Transactions",
    "User",
    "Withdraw",
    "Withdraws",
    "MyWithdraws",
    "Mining",
    "Deposits",
    "Notification",
    "Notifications",
    "Kyc",
    "Agents",
    "Agent",
    "Package",
    "Packages",
    "LiveTrade",
    "LiveTradeProfitRate",
    "PoolConfig",
    "PoolHistory",
    "SignalTradeConfig",
    "Announcement",
    "Deposit",
    "Booster",
  ],
  endpoints: (builder) => ({}),
});

//https://wfc-api.herokuapp.com/api/v1
//http://localhost:5005/api/v1
