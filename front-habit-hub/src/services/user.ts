import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TypeResetPasswordCredentials, TypeUser, TypeUserProfile } from '../types'
import { getToken } from '../utils';


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
    registerUser: builder.mutation<{ emailSent: boolean }, FormData>({
      query: (body) => ({
        url: 'user',
        method: 'POST',
        body
      }),
    }),
    verifyEmail: builder.mutation<{ success: boolean; message: string }, string>({
      query: (code) => ({
        url: `user/email_verification?code=${code}`,
        method: 'PATCH',
      }),
    }),
    resetPassword: builder.mutation<{ success: boolean }, TypeResetPasswordCredentials>({
      query: (body) => ({
        url: 'user/password/reset',
        method: 'PATCH',
        body
      })
    }),
    verifyResetCode: builder.mutation<{ success: boolean }, { code: string }>({
      query: (body) => ({
        url: `user/password/code_verification`,
        method: 'PATCH',
        body
      }),
    }),
    getUserData: builder.query<{ user: TypeUser }, string | null>({
      query: (id) => {
        const token = getToken();
        return {
          url: `user/${id}`,
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
          url: 'user/profile',
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
