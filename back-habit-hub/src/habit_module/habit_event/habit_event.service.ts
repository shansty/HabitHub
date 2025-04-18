import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { HabitEvent } from './entities/habit_event.entity';
import { Habit } from '../habit/entities/habit.entity';

@Injectable()
export class HabitEventService {
  constructor(
    @InjectRepository(HabitEvent)
    private habitEventRepository: Repository<HabitEvent>
  ) { }



  async addEventValue(habitId: number, logValue: number, date: string) {
    if(logValue < 0) {
      throw new BadRequestException("Negative numbers are not available.")
    }
    const habit_event = await this.habitEventRepository.findOne({
      where: {
        habitId: habitId,
        date: new Date (date)
      },
      relations: ['habit']
    })
    if (!habit_event) {
      throw new NotFoundException('Error edding a progress value. Please reload the page.');
    }
    habit_event.value += logValue;
    const isCompleted = this.checkIsGoalCompleted(habit_event.habit.goal, habit_event.value)
    if (isCompleted) {
      habit_event.isGoalCompleted = true;
    }
    await this.habitEventRepository.save(habit_event);

    return { 
      success: true,
      isGoalCompleted: isCompleted
    };
  }

  async fetchOrCreateHabitEvents(habits: Habit[], date: Date): Promise<Map<number, HabitEvent>> {
    const eventMap = this.getExistingEventsForDate(habits, date);
    const missingEvents: HabitEvent[] = [];
    for (const habit of habits) {
      if (!eventMap.has(habit.id)) {
        const newEvent = this.createDefaultHabitEvent(habit, date);
        missingEvents.push(newEvent);
        eventMap.set(habit.id, newEvent);
      }
    }
    if (missingEvents.length > 0) {
      await this.habitEventRepository.save(missingEvents);
    }
    return eventMap;
  }


  getExistingEventsForDate(habits: Habit[], date: Date): Map<number, HabitEvent> {
    const map = new Map<number, HabitEvent>();
    for (const habit of habits) {
      for (const event of habit.events) {
        if (this.isSameDay(new Date(event.date), date)) {
          map.set(habit.id, event);
          break;
        }
      }
    }
    return map;
  }


  createDefaultHabitEvent(habit: Habit, date: Date): HabitEvent {
    const newEvent = this.habitEventRepository.create({
      habit: habit,
      habitId: habit.id,
      date: date,
      value: 0,
      isGoalCompleted: false,
      isFailure: false,
    });
    return newEvent
  }


  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }


  checkIsGoalCompleted(goal: number, value: number): boolean {
    if (value >= goal) {
      return true;
    } else {
      return false
    }
  }
}