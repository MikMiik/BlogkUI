import { commentEndpoints } from "./commentEndpoints";
import { baseApi } from "../baseApi";

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...commentEndpoints(builder),
  }),
});

export const {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
} = commentsApi;
