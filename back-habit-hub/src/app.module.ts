import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/users.entity'
import { EmailModule } from './email/email.module';
import { HabitModule } from './habit/habit.module';
import { Habit } from './habit/entities/habit.entity';
import { HabitOccurrenceModule } from './habit_occurrence/habit_occurrence.module';
import { HabitScheduleModule } from './habit_schedule/habit_schedule.module';
import { HabitEventModule } from './habit_event/habit_event.module';
import { HabitSchedule } from './habit_schedule/entities/habit_schedule.entity';
import { HabitEvent } from './habit_event/entities/habit_event.entity';
import { HabitOccurrence } from './habit_occurrence/entities/habit_occurrence.entity';
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
      entities: [User, Habit, HabitSchedule, HabitEvent, HabitOccurrence],
      synchronize: true,
    }),
    UsersModule,
    EmailModule,
    HabitModule,
    HabitOccurrenceModule,
    HabitScheduleModule,
    HabitEventModule,
    HabitOccurrenceModule,
  ],
  controllers: [], 
  providers: [], 
})
export class AppModule {}
