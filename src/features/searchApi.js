import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    searchUsers: builder.query({
      query: (searchTerm) => ({
        url: `/profiles`,
        params: { search: searchTerm },
      }),
      transformResponse: (response) => response.data,
    }),
    searchPosts: builder.query({
      query: (searchTerm) => ({
        url: `/posts/search`,
        params: { search: searchTerm },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useSearchUsersQuery, useSearchPostsQuery } = searchApi;
