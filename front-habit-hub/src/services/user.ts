import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ResetPasswordCredentials, User } from '../types'
import { getToken } from '../utils';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_LOCAL_HOST}/user` }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ token: string }, User>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
    }),
    registerUser: builder.mutation<{ emailSent: boolean }, FormData>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
    }),
    verifyEmail: builder.mutation<{ success: boolean; message: string }, string>({
      query: (code) => ({
        url: `email_verification?code=${code}`,
        method: 'PATCH',
      }),
    }),
    resetPassword: builder.mutation<{ success: boolean }, ResetPasswordCredentials>({
      query: (body) => ({
        url: 'password/reset',
        method: 'PATCH',
        body
      })
    }),
    verifyResetCode: builder.mutation<{ success: boolean }, { code: string }>({
      query: (body) => ({
        url: `password/code_verification`,
        method: 'PATCH',
        body
      }),
    }),
    getUserData: builder.query<{ user: User }, string | null>({
      query: (id) => {
        const token = getToken();
        return {
          url: `${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    updateUserProfile: builder.mutation<{ success: boolean }, FormData | undefined>({
      query: (body) => {
        const token = getToken();
        return {
          url: 'profile',
          method: 'PATCH',
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
})

export const {
  useLoginUserMutation,
  useGetUserDataQuery,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useVerifyResetCodeMutation,
  useUpdateUserProfileMutation
} = userApi
