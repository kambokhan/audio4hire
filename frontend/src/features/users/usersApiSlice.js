import {
    /* createSelector, */
    createEntityAdapter
} from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({})
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        getUserById: builder.query({
            query: id => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }]
        }),
        registerUser: builder.mutation({
            query: initialUser => ({
                url: '/users',
                method: 'POST',
                body: initialUser
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }]
        }),
        updateUser: builder.mutation({
            query: ({ id, ...updatedData }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: updatedData
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ]
        })
    })
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useRegisterUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice