import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './user_module/users/users.module'
import { ConfigModule } from '@nestjs/config'
import { User } from './user_module/users/entities/users.entity'
import { EmailModule } from './internal_module/email/email.module'
import { HabitModule } from './habit_module/habit/habit.module'
import { Habit } from './habit_module/habit/entities/habit.entity'
import { HabitOccurrenceModule } from './habit_module/habit_occurrence/habit_occurrence.module'
import { HabitScheduleModule } from './habit_module/habit_schedule/habit_schedule.module'
import { HabitEventModule } from './habit_module/habit_event/habit_event.module'
import { HabitSchedule } from './habit_module/habit_schedule/entities/habit_schedule.entity'
import { HabitEvent } from './habit_module/habit_event/entities/habit_event.entity'
import { HabitOccurrence } from './habit_module/habit_occurrence/entities/habit_occurrence.entity'
import { TaskModule } from './schedule_module/task.module'
import { FriendshipModule } from './friendship/friendship.module';
import { Friendship } from './friendship/entities/friendship.entity'
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/entities/notification.entity'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            entities: [User, Habit, HabitSchedule, HabitEvent, HabitOccurrence, Friendship, Notification],
            synchronize: false,
        }),
        UsersModule,
        EmailModule,
        HabitModule,
        HabitOccurrenceModule,
        HabitScheduleModule,
        HabitEventModule,
        HabitOccurrenceModule,
        TaskModule,
        FriendshipModule,
        NotificationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
