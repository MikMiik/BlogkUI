import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/mark-as-read`,
        method: "POST",
      }),
    }),
  }),
});

export const { useMarkNotificationAsReadMutation } = notificationApi;
