import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOneProfile: builder.query({
      query: ({ username, page, limit }) =>
        `profiles/${username}?page=${page}&limit=${limit}`,
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
        url: `profiles/${id}`,
        method: "PATCH",
        body: data,
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
  useGetAllProfilesQuery,
  useGetOneProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = profileApi;
