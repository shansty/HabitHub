import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '../types'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/auth`,
    }),
    refetchOnFocus: true,
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string }, User>({
            query: (body) => ({
                url: 'login',
                method: 'POST',
                body,
            }),
        }),
        register: builder.mutation<{ emailSent: boolean }, FormData>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
} = authApi
