export const commentEndpoints = (builder) => ({
  createComment: builder.mutation({
    query: (data) => ({
      url: "comments",
      method: "POST",
      body: data,
    }),
    invalidatesTags: (result, error, { postId }) => [
      { type: "Comment", postId },
    ],
  }),
  updateComment: builder.mutation({
    query: ({ id, data }) => ({
      url: `comments/${id}`,
      method: "PATCH",
      body: data,
    }),
    invalidatesTags: (result, error, { postId }) => [
      { type: "Comment", postId },
    ],
  }),
  deleteComment: builder.mutation({
    query: ({ id }) => ({
      url: `comments/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result, error, { postId }) => [
      { type: "Comment", postId },
    ],
  }),
});
