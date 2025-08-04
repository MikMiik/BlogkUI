import { baseApi } from "./baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upsertSetting: builder.mutation({
      query: (data) => ({
        url: `settings`,
        method: "POST",
        body: data,
      }),
    }),
    getSettingByUserId: builder.query({
      query: (userId) => `settings/${userId}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useUpsertSettingMutation, useGetSettingByUserIdQuery } =
  settingsApi;
