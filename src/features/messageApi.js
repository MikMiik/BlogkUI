import { baseApi } from "./baseApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllConversation: builder.query({
      query: () => `messages`,
      transformResponse: (response) => response.data,
    }),
    getOneConversation: builder.query({
      query: (conversationId) => `messages/${conversationId}`,
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

export const {
  useGetAllConversationQuery,
  useGetOneConversationQuery,
  useCreateMessageMutation,
} = messageApi;
