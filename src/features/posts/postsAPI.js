import { postEndpoints } from "./postEndpoints";
import { commentEndpoints } from "./commentEndpoints";
import { baseApi } from "../baseApi";

export const postsApi = baseApi.injectEndpoints({
  // reducerPath: "postsApi",
  // baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    ...postEndpoints(builder),
    ...commentEndpoints(builder),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetOnePostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = postsApi;
