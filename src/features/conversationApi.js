import { baseApi } from "./baseApi";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllConversation: builder.query({
      query: () => `conversations`,
      transformResponse: (response) => response.data,
    }),
    getSharedConversation: builder.query({
      query: (otherId) => `conversations/${otherId}`,
      transformResponse: (response) => response.data,
    }),
    markRead: builder.mutation({
      query: (conversationId) => ({
        url: `conversations/${conversationId}/mark-read`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetAllConversationQuery,
  useMarkReadMutation,
  useGetSharedConversationQuery,
} = conversationApi;
