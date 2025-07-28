import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  reducerPath: "profileApi",
  endpoints: (builder) => ({
    getOneProfile: builder.query({
      query: ({ username, page, limit }) =>
        `profiles/${username}?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data,
    }),
    getOneProfileToEdit: builder.query({
      query: ({ username }) => `profiles/${username}/edit`,
      transformResponse: (response) => response.data,
    }),
    createProfile: builder.mutation({
      query: (data) => ({
        url: "profiles",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
    updateProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `profiles/${id}/edit`,
        method: "PUT",
        body: data,
      }),
    }),
    followProfile: builder.mutation({
      query: (id) => ({
        url: `profiles/${id}/follow`,
        method: "POST",
      }),
      transformResponse: (response) => response.data,
    }),
    unfollowProfile: builder.mutation({
      query: (id) => ({
        url: `profiles/${id}/unfollow`,
        method: "DELETE",
      }),
      transformResponse: (response) => response.data,
    }),
    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `profiles/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetOneProfileQuery,
  useGetOneProfileToEditQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useFollowProfileMutation,
  useUnfollowProfileMutation,
  useDeleteProfileMutation,
} = profileApi;
