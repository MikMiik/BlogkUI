import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const topicsAPI = createApi({
  reducerPath: "topicsAPI",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getAllTopics: builder.query({
      query: () => `topics`,
      transformResponse: (response) => response.data,
    }),
    getOneTopic: builder.query({
      query: (slug) => `topics/${slug}`,
      transformResponse: (response) => response.data,
    }),
    createTopic: builder.mutation({
      query: (data) => ({
        url: "topics",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
    updateTopic: builder.mutation({
      query: ({ id, data }) => ({
        url: `topics/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
    deleteTopic: builder.mutation({
      query: (id) => ({
        url: `topics/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllTopicsQuery,
  useGetOneTopicQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = topicsAPI;
