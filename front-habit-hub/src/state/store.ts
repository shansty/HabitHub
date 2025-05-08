import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from '../services/user'
import { habitApi } from '../services/habit'
import { habitEventApi } from '../services/habit_event'
import { friendshipApi } from '../services/friendship'
import { authApi } from '../services/auth'
import { notificationApi } from '../services/notification'

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [habitApi.reducerPath]: habitApi.reducer,
        [habitEventApi.reducerPath]: habitEventApi.reducer,
        [friendshipApi.reducerPath]: friendshipApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            userApi.middleware,
            habitApi.middleware,
            habitEventApi.middleware,
            friendshipApi.middleware,
            authApi.middleware,
            notificationApi.middleware
        ]),
})

setupListeners(store.dispatch)
