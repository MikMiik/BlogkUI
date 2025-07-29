import { postEndpoints } from "./postEndpoints";
import { baseApi } from "../baseApi";

export const postsApi = baseApi.injectEndpoints({
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
