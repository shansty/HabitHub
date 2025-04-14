import { Module } from '@nestjs/common';
import { HabitOccurrenceService } from './habit_occurrence.service';
import { HabitOccurrenceController } from './habit_occurrence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { HabitEvent } from '../habit_event/entities/habit_event.entity';
import { Habit } from '../habit/entities/habit.entity';
import { HabitOccurrence } from './entities/habit_occurrence.entity';
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
  controllers: [HabitOccurrenceController],
  providers: [HabitOccurrenceService],
  exports: [HabitOccurrenceService],
})
export class HabitOccurrenceModule {}

