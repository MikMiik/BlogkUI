import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/mark-as-read`,
        method: "POST",
      }),
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `notifications/mark-all-as-read`,
        method: "POST",
      }),
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
