import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TypeLoginUser } from '../types'


export const userApi = createApi({
  reducerPath: 'userApi', 
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ token: string }, TypeLoginUser>({
        query: (body) => ({
          url: 'user/login', 
          //for register willbe user/
          method: 'POST',
          body,
        }),
      }),
    getUserData: builder.query({query: (id:number) => `user/${id}`})
  }),
})

export const {
  useLoginUserMutation ,
  useGetUserDataQuery
} = userApi
