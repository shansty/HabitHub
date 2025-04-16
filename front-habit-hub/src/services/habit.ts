import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TypeCategoryConfig, TypeHabitCreateData, TypeUserHabitsList } from '../types';
import { getToken } from '../utils';


export const habitApi = createApi({
  reducerPath: 'habitApi',
  tagTypes: ['Habit'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_LOCAL_HOST}/habit`,
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
    getHabitCategories: builder.query<TypeCategoryConfig[], void>({
      query: () => '/categories',
    }),
    getUserHabitsByDate: builder.query<TypeUserHabitsList[], string>({
      query: (date) => `?date=${date}`,
      providesTags: (result, error, date) => [{ type: 'Habit', id: date }],
    }),
    createHabit: builder.mutation<{ success: boolean }, TypeHabitCreateData>({
      query: (body) => ({
        url: ``,
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Habit' }],
    }),
    deleteHabit: builder.mutation<{ success: boolean }, number>({
      query: (habitId) => ({
        url: `/${habitId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Habit' }],
    }),
    editHabit: builder.mutation<TypeUserHabitsList, { habitId: number, habitData: TypeHabitCreateData }>({
      query: ({ habitId, habitData }) => ({
        url: `/${habitId}`,
        method: 'PATCH',
        body: habitData,
      }),
      invalidatesTags: [{ type: 'Habit' }],
    }),
  }),
});

export const {
  useGetHabitCategoriesQuery,
  useCreateHabitMutation,
  useLazyGetUserHabitsByDateQuery,
  useDeleteHabitMutation,
  useEditHabitMutation
} = habitApi;
