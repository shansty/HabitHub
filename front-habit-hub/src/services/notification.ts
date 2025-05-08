import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../utils'
import { FRIENDSHIP_TAG, NOTIFICATION_TAG } from './api_tags'
import { NotificationPreview } from '../types'
import { FriendshipStatus } from '../enums';

type PaginatedNotificationResponse = {
    notifications: NotificationPreview[];
    nextPage: number | null;
};


export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    tagTypes: [NOTIFICATION_TAG, FRIENDSHIP_TAG],
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/notification`,
        prepareHeaders: (headers) => {
            const token = getToken()
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    refetchOnFocus: true,
    endpoints: (builder) => ({
        getUserNotifications: builder.infiniteQuery<
            PaginatedNotificationResponse,
            void,
            number
        >({
            query: ({ pageParam = 1 }) => ({
                url: `?page=${pageParam}`,
            }),
            infiniteQueryOptions: {
                initialPageParam: 1,
                getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
            },
            providesTags: [NOTIFICATION_TAG],
        }),
        acceptFriendshipRequest: builder.mutation<{ success: boolean }, { notificationId: number, senderId: number,}>({
            query: ({ notificationId, senderId }) => ({
                url: `${notificationId}`,
                method: 'PATCH',
                body: { status: FriendshipStatus.ACCEPTED, senderId },
            }),
            invalidatesTags: [NOTIFICATION_TAG, FRIENDSHIP_TAG],
        }),

        rejectFriendshipRequest: builder.mutation<{ success: boolean }, { notificationId: number, senderId: number }>({
            query: ({ notificationId, senderId }) => ({
                url: `${notificationId}`,
                method: 'PATCH',
                body: { status: FriendshipStatus.REJECTED, senderId },
            }),
            invalidatesTags: [NOTIFICATION_TAG, FRIENDSHIP_TAG],
        }),
    }),
})

export const { 
    useGetUserNotificationsInfiniteQuery,
    useAcceptFriendshipRequestMutation, 
    useRejectFriendshipRequestMutation
} = notificationApi
