export const postEndpoints = (builder) => ({
  getAllPosts: builder.query({
    query: ({ limit = 10, page = 1 }) => `posts?limit=${limit}&page=${page}`,
    transformResponse: (response) => response.data,
    providesTags: ["Post"],
  }),
  getOwnPosts: builder.query({
    query: ({ limit = 10, page = 1 }) =>
      `posts/my-posts?limit=${limit}&page=${page}`,
    transformResponse: (response) => response.data,
    providesTags: ["OwnPost"],
  }),
  getOnePost: builder.query({
    query: (id) => `posts/${id}`,
    transformResponse: (response) => response.data,
    providesTags: (result) => (result ? [{ type: "Post", id: result.id }] : []),
  }),
  getPostToEdit: builder.query({
    query: (id) => `posts/write/${id}`,
    transformResponse: (response) => response.data,
    providesTags: ["OwnPost"],
  }),
  getBookmarkPosts: builder.query({
    query: ({ limit = 10, page = 1 }) =>
      `posts/bookmarks?limit=${limit}&page=${page}`,
    transformResponse: (response) => response.data,
  }),
  getComments: builder.query({
    query: ({ postId, limitComments }) =>
      `posts/${postId}/comments?limitComments=${limitComments}`,
    transformResponse: (response) => response.data,
  }),
  createPost: builder.mutation({
    query: (data) => ({
      url: "posts",
      method: "POST",
      body: data,
    }),
    transformResponse: (response) => response.data,
    invalidatesTags: ["OwnPost"],
  }),
  draftpost: builder.mutation({
    query: (data) => ({
      url: "posts/draft",
      method: "POST",
      body: data,
    }),
    transformResponse: (response) => response.data,
    invalidatesTags: ["OwnPost"],
  }),
  publishPost: builder.mutation({
    query: (data) => ({
      url: "posts/publish",
      method: "POST",
      body: data,
    }),
    transformResponse: (response) => response.data,
    invalidatesTags: ["OwnPost"],
  }),
  editPost: builder.mutation({
    query: ({ id, data }) => ({
      url: `posts/write/${id}`,
      method: "PATCH",
      body: data,
    }),
    transformResponse: (response) => response.data,
    invalidatesTags: ["OwnPost"],
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
    invalidatesTags: ["OwnPost"],
  }),
});
