import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from '../services/user'
import { habitApi } from '../services/habit'
import { habitEventApi } from '../services/habit_event'
import { authApi } from '../services/auth'

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [habitApi.reducerPath]: habitApi.reducer,
        [habitEventApi.reducerPath]: habitEventApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            userApi.middleware,
            habitApi.middleware,
            habitEventApi.middleware,
            authApi.middleware
        ]),
})

setupListeners(store.dispatch)
