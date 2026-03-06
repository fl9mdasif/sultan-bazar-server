import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET all users (admin/superAdmin)
        getAllUsers: build.query({
            query: (params) => ({
                url: "/users",
                method: "GET",
                params,
            }),
            providesTags: [tagTypes.users],
        }),

        // PATCH user role (superAdmin)
        updateUserRole: build.mutation({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: "PATCH",
                data: { role },
            }),
            invalidatesTags: [tagTypes.users],
        }),

        // PATCH block/unblock user (superAdmin)
        toggleBlockUser: build.mutation({
            query: (id: string) => ({
                url: `/users/${id}/block`,
                method: "PATCH",
            }),
            invalidatesTags: [tagTypes.users],
        }),

        // DELETE user (superAdmin)
        deleteUser: build.mutation({
            query: (id: string) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.users],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
    useToggleBlockUserMutation,
    useDeleteUserMutation,
} = userApi;
