import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../utils';


export const habitEventApi = createApi({
  reducerPath: 'habitEventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_LOCAL_HOST}/habit-event`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    addEventValue: builder.mutation<{ success: boolean, isGoalCompleted: boolean }, { habitId: number, logValue: number }>({
      query: ({ habitId, logValue }) => ({
        url: `/${habitId}`,
        method: 'PATCH',
        body: { logValue }
      }),
    }),
  }),
});

export const {
  useAddEventValueMutation
} = habitEventApi;
