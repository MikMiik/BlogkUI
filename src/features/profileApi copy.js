import { baseApi } from "./baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upload: builder.mutation({
      query: (data) => ({
        url: "upload",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useUploadMutation } = uploadApi;
