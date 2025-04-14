import { Module } from '@nestjs/common';
import { HabitEventService } from './habit_event.service';
import { HabitEventController } from './habit_event.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HabitEvent } from './entities/habit_event.entity';
import { Habit } from '../habit/entities/habit.entity';
import { HabitOccurrence } from '../habit_occurrence/entities/habit_occurrence.entity';
import { User } from '../users/entities/users.entity';
import { HabitSchedule } from '../habit_schedule/entities/habit_schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HabitEvent, Habit, HabitOccurrence, User, HabitSchedule]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '120h' },
      }),
    }),
    AuthModule
  ],
  controllers: [HabitEventController],
  providers: [HabitEventService],
})
export class HabitEventModule { }

