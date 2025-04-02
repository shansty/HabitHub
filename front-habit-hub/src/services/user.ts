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
        method: 'POST',
        body,
      }),
    }),
    registerUser: builder.mutation<{emailSent: boolean}, FormData>({
      query: (body) => ({
        url: 'user',
        method: 'POST',
        body
      }),
    }),
    verifyEmail: builder.mutation<{ success: boolean; message: string }, string>({
      query: (code) => ({
        url: `user/verify-email/${code}`,
        method: 'PUT',
      }),
    }),
    getUserData: builder.query({ query: (id: number) => `user/${id}` })
  }),
})

export const {
  useLoginUserMutation,
  useGetUserDataQuery,
  useRegisterUserMutation,
  useVerifyEmailMutation
} = userApi
