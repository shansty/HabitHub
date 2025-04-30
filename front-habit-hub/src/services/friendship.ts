import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../utils'
import { UserPreview } from '../types';
import { FRIENDSHIP_TAG } from './apiTags';


  
  type FriendsResponse = {
    friends: UserPreview[];
    nextPage: number | null;
  };
  

export const friendshipApi = createApi({
    reducerPath: 'friendshipApi',
    tagTypes: [FRIENDSHIP_TAG],
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_LOCAL_HOST}/friendship`,
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
        sendFriendRequest: builder.mutation<{ success: boolean }, { senderId: number; receiverId: number }>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body,
            }),
        }),
        getUserFriends: builder.infiniteQuery<FriendsResponse, void, number>({
            query: ({ pageParam = 1 }) => `?page=${pageParam}`,
            infiniteQueryOptions: {
              initialPageParam: 1,
              getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
            },
            providesTags: [FRIENDSHIP_TAG]
          }),
        deleteFriend: builder.mutation<{ success: boolean }, number>({
            query: (friendId) => ({
                url: `${friendId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [FRIENDSHIP_TAG],
        }),
    }),
});

export const {
    useSendFriendRequestMutation,
    useDeleteFriendMutation,
    useGetUserFriendsInfiniteQuery
} = friendshipApi
