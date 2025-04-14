import { Module } from '@nestjs/common';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { User } from '../users/entities/users.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HabitSchedule } from '../habit_schedule/entities/habit_schedule.entity';
import { HabitEvent } from '../habit_event/entities/habit_event.entity';
import { HabitOccurrence } from '../habit_occurrence/entities/habit_occurrence.entity';
import { HabitEventModule } from '../habit_event/habit_event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, User, HabitSchedule, HabitEvent, HabitOccurrence]),
    JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('SECRET'),
            signOptions: { expiresIn: '120h' },
          }),
        }),
        AuthModule,
        HabitEventModule
  ],
  controllers: [HabitController],
  providers: [HabitService],
})
export class HabitModule {}
