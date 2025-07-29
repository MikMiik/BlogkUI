import { baseApi } from "./baseApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversationMessages: builder.query({
      query: (conversationId) => `messages?conversationId=${conversationId}`,
      transformResponse: (response) => response.data,
    }),

    createMessage: builder.mutation({
      query: (data) => ({
        url: "messages",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetConversationMessagesQuery, useCreateMessageMutation } =
  messageApi;
