import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TypeUser } from '../types'


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ token: string }, TypeUser>({
      query: (body) => ({
        url: 'user/login',
        //for register willbe user/
        method: 'POST',
        body,
      }),
    }),
    createUser: builder.mutation<{ user: TypeUser }, TypeUser>({
      query: (body) => ({
        url: 'user',
        method: 'POST',
        body,
      }),
    }),
    getUserData: builder.query({ query: (id: number) => `user/${id}` })
  }),
})

export const {
  useLoginUserMutation,
  useGetUserDataQuery,
  useCreateUserMutation
} = userApi
