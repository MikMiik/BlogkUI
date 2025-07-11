export const postEndpoints = (builder) => ({
  getAllPosts: builder.query({
    query: ({ limit, page }) => `posts?limit=${limit}&page=${page}`,
    transformResponse: (response) => response.data,
  }),
  getOnePost: builder.query({
    query: (slug) => `posts/${slug}`,
    transformResponse: (response) => response.data,
    providesTags: (result) => (result ? [{ type: "Post", id: result.id }] : []),
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
  deletePost: builder.mutation({
    query: (id) => ({
      url: `posts/${id}`,
      method: "DELETE",
    }),
  }),
});
