import {
    createEntityAdapter
} from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const listingsAdapter = createEntityAdapter({})
const initialState = listingsAdapter.getInitialState()

export const listingsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getListings: builder.query({
            query: () => '/listings',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedListings = responseData.map(listing => {
                    listing.id = listing._id
                    return listing
                });
                return listingsAdapter.setAll(initialState, loadedListings)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Listing', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Listing', id }))
                    ]
                } else return [{ type: 'Listing', id: 'LIST' }]
            }
        }),
        getListingsByUserId: builder.query({
            query: userId => `/listings?userId=${userId}`,
            transformResponse: responseData => {
                const loadedListings = responseData.map(listing => {
                    listing.id = listing._id;
                    return listing;
                });
                return listingsAdapter.setAll(initialState, loadedListings);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Listing', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Listing', id }))
                    ]
                } else return [{ type: 'Listing', id: 'LIST' }]
            }
        }),
        getListingByID: builder.query({
            query: id => `/listings/${id}`,
            providesTags: (result, error, id) => [{ type: 'Listing', id }]
        }),
        createListing: builder.mutation({
            query: initialListing => ({
                url: '/listings',
                method: 'POST',
                body: initialListing
            }),
            invalidatesTags: [{ type: 'Listing', id: 'LIST' }]

        }),
        updateListing: builder.mutation({
            query: ({ id, ...updatedData }) => ({
                url: `/listings/${id}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: updatedData
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Listing', id },
                { type: 'Listing', id: 'LIST' }
            ]

        }),
        deleteListing: builder.mutation({
            query: ({ id }) => ({
                url: `/listings/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Listing', id },
                { type: 'Listing', id: 'LIST' }
            ]
        })
    })
})

export const {
    useGetListingsQuery,
    useGetListingByIDQuery,
    useGetListingsByUserIdQuery,
    useCreateListingMutation,
    useUpdateListingMutation,
    useDeleteListingMutation
} = listingsApiSlice