import { Module } from '@nestjs/common';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { User } from '../users/entities/users.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HabitSchedule } from './entities/habit_repeat.entity';
import { HabitEvent } from './entities/habit_event.entity';
import { HabitDay } from './entities/habit_day.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, User, HabitSchedule, HabitEvent, HabitDay]),
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
  controllers: [HabitController],
  providers: [HabitService],
})
export class HabitModule {}
