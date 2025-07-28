import { postEndpoints } from "./postEndpoints";
import { baseApi } from "../baseApi";

export const postsApi = baseApi.injectEndpoints({
  // reducerPath: "postsApi",
  // baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    ...postEndpoints(builder),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetOwnPostsQuery,
  useGetOnePostQuery,
  useGetBookmarkPostsQuery,
  useGetPostToEditQuery,
  useGetCommentsQuery,
  useCreatePostMutation,
  useDraftpostMutation,
  usePublishPostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useBookmarkPostMutation,
  useUnBookmarkPostMutation,
  useClearBookmarksMutation,
} = postsApi;
