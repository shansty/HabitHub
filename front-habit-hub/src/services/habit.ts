import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TypeCategory, TypeHabit } from '../types';
import { getToken } from '../utils';


export const habitApi = createApi({
  reducerPath: 'habitApi',
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
    getAllHabitCategories: builder.query<{ categories: TypeCategory[] }, void>({
      query: () => ({
        url: `category`,
        method: 'GET',
      }),
    }),
    createHabit: builder.mutation<{ success: boolean }, TypeHabit>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAllHabitCategoriesQuery,
  useCreateHabitMutation,
} = habitApi;
