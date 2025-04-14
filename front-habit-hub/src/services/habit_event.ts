import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TypeHabitEvent } from '../types';
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
    findOrCreateEmptyHabitEvent: builder.mutation<{habitId: number, date: Date}, TypeHabitEvent>({
      query: (body) => ({
        url: ``,
        method: 'POST',
        body
      }),
    }),
  }),
});

export const {
  useFindOrCreateEmptyHabitEventMutation
} = habitEventApi;
