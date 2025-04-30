import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    CategoryData,
    HabitCreateData,
    UsersHabitDetailedResponseData,
    UsersHabitPreviewResponseData,
} from '../types'
import { getToken } from '../utils'
import { HABIT_TAG, HABIT_DETAILS_TAG } from './api_tags'

export const habitApi = createApi({
    reducerPath: 'habitApi',
    tagTypes: [HABIT_TAG, HABIT_DETAILS_TAG],
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_LOCAL_HOST}/habit`,
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
        getHabitCategories: builder.query<CategoryData[], void>({
            query: () => '/categories',
        }),
        getUserHabitsByDate: builder.query<
            UsersHabitPreviewResponseData[],
            string
        >({
            query: (date) => `?date=${date}`,
            providesTags: (_result, _error, date) => [
                { type: HABIT_TAG, id: date },
            ],
        }),
        getFriendUserHabitsByDate: builder.query<
            UsersHabitPreviewResponseData[],
            { friendId: string; date: string }
        >({
            query: ({ friendId, date }) => `friend/${friendId}?date=${date}`,
            providesTags: (_result, _error, { date }) => [
                { type: HABIT_TAG, id: date },
            ],
        }),
        getHabitById: builder.query<UsersHabitDetailedResponseData, string>({
            query: (id) => `/${id}`,
            providesTags: (_result, _error, date) => [
                { type: HABIT_DETAILS_TAG, id: date },
            ],
        }),
        getFriendHabitById: builder.query<UsersHabitDetailedResponseData, { friendId: string; habitId: string }>({
            query: ({ friendId, habitId }) => `friend/${friendId}/habits/${habitId}`,
            providesTags: (_result, _error, { habitId }) => [
                { type: HABIT_DETAILS_TAG, id: habitId },
            ],
        }),
        createHabit: builder.mutation<{ success: boolean }, HabitCreateData>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: HABIT_TAG }],
        }),
        deleteHabit: builder.mutation<{ success: boolean }, number>({
            query: (habitId) => ({
                url: `/${habitId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Habit' }],
        }),
        editHabit: builder.mutation<
            UsersHabitPreviewResponseData,
            { habitId: number; habitData: HabitCreateData }
        >({
            query: ({ habitId, habitData }) => ({
                url: `/${habitId}`,
                method: 'PATCH',
                body: habitData,
            }),
            invalidatesTags: [{ type: HABIT_TAG }, { type: HABIT_DETAILS_TAG }],
        }),
        startNewHabitAttempt: builder.mutation<
            { success: true },
            { date: Date; habitId: string }
        >({
            query: ({ date, habitId }) => ({
                url: `/${habitId}/attempt`,
                method: 'PATCH',
                body: { date },
            }),
            invalidatesTags: [{ type: HABIT_TAG }, { type: HABIT_DETAILS_TAG }],
        }),
    }),
})

export const {
    useGetHabitCategoriesQuery,
    useCreateHabitMutation,
    useLazyGetUserHabitsByDateQuery,
    useLazyGetFriendUserHabitsByDateQuery,
    useDeleteHabitMutation,
    useEditHabitMutation,
    useGetHabitByIdQuery,
    useGetFriendHabitByIdQuery,
    useStartNewHabitAttemptMutation,
} = habitApi
