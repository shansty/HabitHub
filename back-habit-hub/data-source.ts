import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { User } from './src/user_module/users/entities/users.entity'
import { Habit } from './src/habit_module/habit/entities/habit.entity'
import { HabitEvent } from './src/habit_module/habit_event/entities/habit_event.entity'
import { HabitSchedule } from './src/habit_module/habit_schedule/entities/habit_schedule.entity'
import { HabitOccurrence } from './src/habit_module/habit_occurrence/entities/habit_occurrence.entity'
import { Friendship } from './src/friendship/entities/friendship.entity'
import { Notification } from './src/notification/entities/notification.entity'

config({ path: process.env.NODE_ENV === 'prod' ? '.env_production' : '.env' })

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: false,
    migrations: ['src/migrations/*.ts'],
    entities: [User, Habit, HabitEvent, HabitSchedule, HabitOccurrence, Friendship, Notification],
})
