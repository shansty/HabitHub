import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../utils'
import { HABIT_TAG, HABIT_DETAILS_TAG } from './api_tags'

export const habitEventApi = createApi({
    reducerPath: 'habitEventApi',
    tagTypes: [HABIT_TAG, HABIT_DETAILS_TAG],
    baseQuery: fetchBaseQuery({
        // baseUrl: `${import.meta.env.VITE_API_URL}/habit-event`,
        baseUrl: `habit-event`,
        
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
        addEventValue: builder.mutation<
            { success: boolean; isGoalCompleted: boolean },
            { habitId: number; logValue: number; date: Date }
        >({
            query: ({ habitId, logValue, date }) => ({
                url: `/${habitId}`,
                method: 'PATCH',
                body: { logValue, date },
            }),
            invalidatesTags: (_result, _error, { habitId }) => [
                { type: HABIT_TAG },
                { type: HABIT_DETAILS_TAG, id: habitId },
            ],
        }),
    }),
})

export const { useAddEventValueMutation } = habitEventApi
