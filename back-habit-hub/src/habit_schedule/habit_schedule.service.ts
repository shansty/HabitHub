import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitSchedule } from './entities/habit_schedule.entity';
import { Habit } from '../habit/entities/habit.entity';
import { HabitScheduleType } from '../habit/utils/habit_enums';
import { Injectable } from '@nestjs/common';
import { scheduled } from 'rxjs';

@Injectable()
export class HabitScheduleService {
  constructor(
    @InjectRepository(HabitSchedule)
    private readonly habitScheduleRepository: Repository<HabitSchedule>,
  ) { }

  async createSchedule(habit: Habit, scheduleType: HabitScheduleType, scheduleData: { daysOfWeek?: number[]; daysOfMonth?: number[] }): Promise<HabitSchedule> {

    const schedule = this.habitScheduleRepository.create({
      habit,
      type: scheduleType,
      daysOfWeek: scheduleType === HabitScheduleType.DAILY ? scheduleData.daysOfWeek : [],
      daysOfMonth: scheduleType === HabitScheduleType.MONTHLY ? scheduleData.daysOfMonth : [],
    });

    const savedSchedule = await this.habitScheduleRepository.save(schedule)
    return savedSchedule;
  }


  async updateSchedule(schedule: HabitSchedule, type: HabitScheduleType, newData: { daysOfWeek?: number[]; daysOfMonth?: number[] }): Promise<HabitSchedule> {
    schedule.type = type;
    schedule.daysOfWeek = type === HabitScheduleType.DAILY ? newData.daysOfWeek ?? [] : [];
    schedule.daysOfMonth = type === HabitScheduleType.MONTHLY ? newData.daysOfMonth ?? [] : [];
    
    const updatedSchedule = await this.habitScheduleRepository.save(schedule);
    return updatedSchedule;
  }


}