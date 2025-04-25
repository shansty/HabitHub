import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from '../services/user'
import { habitApi } from '../services/habit'
import { habitEventApi } from '../services/habit_event'

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [habitApi.reducerPath]: habitApi.reducer,
        [habitEventApi.reducerPath]: habitEventApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            userApi.middleware,
            habitApi.middleware,
            habitEventApi.middleware,
        ]),
})

setupListeners(store.dispatch)
