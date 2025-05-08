import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FriendshipPreview, ResetPasswordCredentials, User } from '../types'
import { getToken } from '../utils'
import { FRIENDSHIP_REQUEST_TAG } from './api_tags';

export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes: [FRIENDSHIP_REQUEST_TAG],
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/user`,
    }),
    refetchOnFocus: true,
    endpoints: (builder) => ({
        verifyEmail: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (code) => ({
                url: `email_verification?code=${code}`,
                method: 'PATCH',
            }),
        }),
        resetPassword: builder.mutation<
            { success: boolean },
            ResetPasswordCredentials
        >({
            query: (body) => ({
                url: 'password/reset',
                method: 'PATCH',
                body,
            }),
        }),
        verifyResetCode: builder.mutation<
            { success: boolean },
            { code: string }
        >({
            query: (body) => ({
                url: `password/code_verification`,
                method: 'PATCH',
                body,
            }),
        }),
        getUserData: builder.query<{ user: User }, number | null>({
            query: (id) => {
                const token = getToken()
                return {
                    url: `${id}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            },
        }),
        updateUserProfile: builder.mutation<
            { success: boolean },
            FormData | undefined
        >({
            query: (body) => {
                const token = getToken()
                return {
                    url: 'profile',
                    method: 'PATCH',
                    body,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            },
        }),
        searchUsers: builder.query<FriendshipPreview[], string>({
            query: (searchTerm) => {
                const token = getToken();
                return {
                    url: `search?username=${encodeURIComponent(searchTerm)}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
            },
            providesTags: [FRIENDSHIP_REQUEST_TAG]
        }),
        getFriendUserData: builder.query<{ friend: User }, number | null>({
            query: (friendId) => {
                const token = getToken()
                return {
                    url: `friend/${friendId}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            },
        }),
    }),
})

export const {
    useGetUserDataQuery,
    useVerifyEmailMutation,
    useResetPasswordMutation,
    useVerifyResetCodeMutation,
    useUpdateUserProfileMutation,
    useSearchUsersQuery,
    useGetFriendUserDataQuery
} = userApi
