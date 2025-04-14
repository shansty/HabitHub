import { Module } from '@nestjs/common';
import { HabitScheduleService } from './habit_schedule.service';
import { HabitScheduleController } from './habit_schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitEvent } from '../habit_event/entities/habit_event.entity';
import { Habit } from '../habit/entities/habit.entity';
import { HabitOccurrence } from '../habit_occurrence/entities/habit_occurrence.entity';
import { User } from '../users/entities/users.entity';
import { HabitSchedule } from './entities/habit_schedule.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

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
  controllers: [HabitScheduleController],
  providers: [HabitScheduleService],
})
export class HabitScheduleModule {}
