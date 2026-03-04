// import { get } from "http";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBlog: build.mutation({
      query: (data) => ({
        url: "/blogs/create-blog",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.blogs],
    }),

    getAllBlogs: build.query({
      // query: (arg: Record<string, any>) => ({
      query: () => ({
        url: "/blogs",
        method: "GET",
        // params: arg,
      }),
      providesTags: [tagTypes.blogs],
    }),

    getSingleBlog: build.query({
      query: (id) => (
        console.log("singleId", id),
        {
          url: `/blogs/${id}`,
          method: "GET",
        }
      ),
    }),

    updateBlog: build.mutation({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.blogs],
    }),

    deleteBlog: build.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blogs],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
