export const commentEndpoints = (builder) => ({
  createComment: builder.mutation({
    query: (data) => ({
      url: "comments",
      method: "POST",
      body: data,
    }),
    transformResponse: (response) => response.data,
  }),
  updateComment: builder.mutation({
    query: ({ id, data }) => ({
      url: `comments/${id}`,
      method: "PATCH",
      body: data,
    }),
  }),
  likeComment: builder.mutation({
    query: ({ commentId }) => ({
      url: `comments/${commentId}/like`,
      method: "POST",
      body: {
        commentId,
      },
    }),
  }),
  unlikeComment: builder.mutation({
    query: ({ commentId }) => ({
      url: `comments/${commentId}/unlike`,
      method: "DELETE",
      body: {
        commentId,
      },
    }),
  }),
  deleteComment: builder.mutation({
    query: ({ id }) => ({
      url: `comments/${id}`,
      method: "DELETE",
    }),
  }),
});
