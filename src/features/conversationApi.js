import { baseApi } from "./baseApi";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllConversation: builder.query({
      query: () => `conversations`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllConversationQuery } = conversationApi;
