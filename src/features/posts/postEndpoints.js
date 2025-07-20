export const postEndpoints = (builder) => ({
  getAllPosts: builder.query({
    query: ({ limit, page }) => `posts?limit=${limit}&page=${page}`,
    transformResponse: (response) => response.data,
    providesTags: ["Post"],
  }),
  getOnePost: builder.query({
    query: (id) => `posts/${id}`,
    transformResponse: (response) => response.data,
    providesTags: (result) => (result ? [{ type: "Post", id: result.id }] : []),
  }),
  getComments: builder.query({
    query: ({ postId, limitComments }) =>
      // `posts/${postId}/comments`,
      `posts/${postId}/comments?limitComments=${limitComments}`,
    transformResponse: (response) => response.data,
    // providesTags: (result, error, { postId }) =>
    //   result ? [{ type: "Comment", postId }] : [],
  }),
  createPost: builder.mutation({
    query: (data) => ({
      url: "posts",
      method: "POST",
      body: data,
    }),
    transformResponse: (response) => response.data,
  }),
  updatePost: builder.mutation({
    query: ({ id, data }) => ({
      url: `posts/${id}`,
      method: "PATCH",
      body: data,
    }),
    transformResponse: (response) => response.data,
  }),
  likePost: builder.mutation({
    query: ({ postId }) => ({
      url: `posts/${postId}/like`,
      method: "POST",
      body: {
        postId,
      },
    }),
    invalidatesTags: ["Post"],
  }),
  unlikePost: builder.mutation({
    query: ({ postId }) => ({
      url: `posts/${postId}/unlike`,
      method: "DELETE",
      body: {
        postId,
      },
    }),
    invalidatesTags: ["Post"],
  }),
  bookmarkPost: builder.mutation({
    query: ({ postId }) => ({
      url: `posts/${postId}/bookmark`,
      method: "POST",
      body: {
        postId,
      },
    }),
    invalidatesTags: ["Post"],
  }),
  unBookmarkPost: builder.mutation({
    query: ({ postId }) => ({
      url: `posts/${postId}/unbookmark`,
      method: "DELETE",
      body: {
        postId,
      },
    }),
    invalidatesTags: ["Post"],
  }),

  deletePost: builder.mutation({
    query: (id) => ({
      url: `posts/${id}`,
      method: "DELETE",
    }),
  }),
});
