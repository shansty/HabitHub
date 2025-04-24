import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitOccurrence } from './entities/habit_occurrence.entity';
import { Repository } from 'typeorm';
import { Habit } from '../habit/entities/habit.entity';
import { Schedule } from '../habit_enums';

@Injectable()
export class HabitOccurrenceService {
  constructor(
    @InjectRepository(HabitOccurrence)
    private readonly habitOccurrenceRepository: Repository<HabitOccurrence>,
  ) { }

  generateOccurrences(habit: Habit, userId: string, scheduleType: Schedule, scheduleData: { daysOfWeek?: number[]; daysOfMonth?: number[] }): HabitOccurrence[] {
    const occurrences: HabitOccurrence[] = [];
    const start = new Date(habit.startDate);
    for (let i = 0; i < habit.goalDuration; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      if (this.shouldIncludeDate(currentDate, scheduleType, scheduleData)) {
        occurrences.push(
          this.habitOccurrenceRepository.create({
            date: currentDate,
            user: { id: +userId },
            habit,
            habitId: habit.id,
            habitAttempt: habit.attempt
          }),
        );
      }
    }
    return occurrences;
  }


  generateOccurrencesFromDate(habit: Habit, userId: string, scheduleType: Schedule, scheduleData: { daysOfWeek?: number[]; daysOfMonth?: number[] }, date: Date, count: number): HabitOccurrence[] {
    const occurrences: HabitOccurrence[] = [];
    let current = new Date(date);
    while (occurrences.length < count) {
      if (this.shouldIncludeDate(current, scheduleType, scheduleData)) {
        occurrences.push(
          this.habitOccurrenceRepository.create({
            date: new Date(current),
            user: { id: +userId },
            habit,
            habitId: habit.id,
            habitAttempt: habit.attempt
          })
        );
      }
      current.setDate(current.getDate() + 1);
    }
    return occurrences;
  }


  generateOccurrencesForNewAttempt(habit: Habit, userId: string, date: Date): HabitOccurrence[] {
    const occurrences: HabitOccurrence[] = [];
    const startDate = new Date(date);
    for (let i = 0; i < habit.goalDuration; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const scheduleData = {
        daysOfWeek: habit.habitSchedule.daysOfWeek ?? [],
        daysOfMonth: habit.habitSchedule.daysOfMonth ?? []
      }

      if (this.shouldIncludeDate(currentDate, habit.habitSchedule.type, scheduleData)) {
        occurrences.push(
          this.habitOccurrenceRepository.create({
            date: currentDate,
            user: { id: +userId },
            habit,
            habitId: habit.id,
            habitAttempt: habit.attempt
          }),
        );
      }
    }
    return occurrences;
  }


  async getHabitOccurrencesByHabit(habit: Habit): Promise<HabitOccurrence[]> {
    return await this.habitOccurrenceRepository.find({
      where: {
        habitId: habit.id,
        habitAttempt: habit.attempt
      }
    })
  }


  private shouldIncludeDate(date: Date, schedule: Schedule, data: { daysOfWeek?: number[]; daysOfMonth?: number[] }): boolean {
    const jsDay = date.getDay();
    const mappedDay = jsDay === 0 ? 7 : jsDay;
    const dayOfMonth = date.getDate();

    if (schedule === Schedule.DAILY) {
      return data.daysOfWeek?.includes(mappedDay) ?? false;
    }
    if (schedule === Schedule.MONTHLY) {
      return data.daysOfMonth?.includes(dayOfMonth) ?? false;
    }
    return false;
  }

  async getByDate(date: Date): Promise<HabitOccurrence[]> {
    return this.habitOccurrenceRepository.find({
      where: { date },
    });
  }

  async saveMany(occurrences: HabitOccurrence[]): Promise<HabitOccurrence[]> {
    return this.habitOccurrenceRepository.save(occurrences);
  }
}
