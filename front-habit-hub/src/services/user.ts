import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TypeResetPasswordCredentials, TypeUser } from '../types'


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
    verifyEmail: builder.mutation<{ success: boolean; message: string }, string >({
      query: (code) => ({
        url: `user/verify_email?code=${code}`,
        method: 'PATCH',
      }),
    }),
    resetPassword: builder.mutation<{success: boolean}, TypeResetPasswordCredentials>({
      query: (body) => ({
        url: 'user/reset_password',
        method: 'PATCH',
        body
      })
    }),
    verifyResetCode: builder.mutation<{ success: boolean}, {code: string}>({
      query: (body) => ({
        url: `user/verify_reset_code`,
        method: 'PATCH',
        body
      }),
    }),
    getUserData: builder.query({ query: (id: number) => `user/${id}` })
  }),
})

export const {
  useLoginUserMutation,
  useGetUserDataQuery,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useVerifyResetCodeMutation
} = userApi
