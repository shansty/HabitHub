import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TypeLoginUser } from '../types'


export const userApi = createApi({
  reducerPath: 'userApi', 
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    createLoginUser: builder.mutation<TypeLoginUser, Partial<TypeLoginUser>>({
      query: (body) => ({
        url: 'user',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useCreateLoginUserMutation 
} = userApi
