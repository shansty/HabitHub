import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from '../services/user'
import { habitApi } from '../services/habit'

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [habitApi.reducerPath]: habitApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([userApi.middleware, habitApi.middleware]),
})

setupListeners(store.dispatch)