import { baseApi } from "./baseApi";

export const topicsApi = baseApi.injectEndpoints({
  // reducerPath: "topicsAPI",
  // baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getAllTopics: builder.query({
      query: () => `topics`,
      transformResponse: (response) => response.data,
    }),
    getOneTopic: builder.query({
      query: ({ slug, currentPage, limit }) =>
        `topics/${slug}?page=${currentPage}&limit=${limit}`,
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
} = topicsApi;
