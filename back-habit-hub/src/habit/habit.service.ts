import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { Habit } from './entities/habit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { HabitCategoryConfig } from './utils/habit-unit-map';
import { HabitOccurrence } from '../habit_occurrence/entities/habit_occurrence.entity';
import { HabitSchedule } from '../habit_schedule/entities/habit_schedule.entity';
import { HabitEvent } from '../habit_event/entities/habit_event.entity';
import { HabitEventService } from '../habit_event/habit_event.service';
import { HabitScheduleService } from '../habit_schedule/habit_schedule.service';
import { HabitOccurrenceService } from '../habit_occurrence/habit_occurrence.service';



@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    @InjectRepository(HabitOccurrence)
    private readonly habitOccurrenceRepository: Repository<HabitOccurrence>,
    private readonly habitEventService: HabitEventService,
    private readonly habitScheduleService: HabitScheduleService,
    private readonly habitOccurrenceService: HabitOccurrenceService,
  ) { }

  getHabitCategories() {
    return Object.entries(HabitCategoryConfig).map(([name, config]) => ({
      name,
      icons: config.icons,
      defaultIcon: config.defaultIcon,
      defaultUnit: config.defaultUnit,
      allowedUnits: config.allowedUnits,
    }));
  }


  async createHabit(body: CreateHabitDto, userId: string) {
    const habit = await this.createAndSaveHabit(body, userId);

    await this.habitScheduleService.createSchedule(habit, body.habitSchedule, body.habitScheduleData);
    const occurrences = this.habitOccurrenceService.generateOccurrences(habit, userId, body.habitSchedule, body.habitScheduleData);
    await this.habitOccurrenceRepository.save(occurrences);

    return {
      success: true,
      habitId: habit.id,
    };
  }



  async getUserHabitsByDate(userId: string, date: string) {
    const dateObj = new Date(date);
    console.log(dateObj)
    const userHabitOccurrences = await this.habitOccurrenceRepository.find({
      where: {
        user: { id: +userId },
        date: dateObj,
      },
      relations: ['user', 'habit'], 
    });
    console.dir({ userHabitOccurrences })
    const habitIds = userHabitOccurrences.map((occurrence) => occurrence.habitId);
    if (!habitIds.length) return [];
    console.dir({ habitIds })
    const habits = await this.habitRepository.find({
      where: { id: In(habitIds) },
      relations: ['events'],
    });

    const isToday = this.habitEventService.isSameDay(dateObj, new Date());
    console.log(isToday)

    const eventMap = isToday
      ? await this.habitEventService.fetchOrCreateHabitEvents(habits, dateObj)
      : this.habitEventService.getExistingEventsForDate(habits, dateObj);

    console.dir({ eventMap })
    return habits.map(habit => {
      const event = eventMap.get(habit.id);
      return this.buildHabitResponse(habit, event);
    });
  };



  async deleteHabit(habitId: number, userId: number): Promise<{ success: boolean }> {
    const habit = await this.habitRepository.findOne({
      where: { id: habitId, user: { id: userId } },
    });
    if (!habit) {
      throw new NotFoundException('Habit not found or does not belong to the user');
    }
    await this.habitRepository.remove(habit);
    return { success: true };
  }


  async createAndSaveHabit(body: CreateHabitDto, userId: string): Promise<Habit> {
    const habit = this.habitRepository.create({
      name: body.name,
      goal: body.goal,
      goalDuration: body.goalDuration,
      unit: body.unit,
      icon: body.icon,
      goalPeriodicity: body.goalPeriodicity,
      startDate: body.startDate,
      category: body.category,
      user: { id: +userId },
    });

    const savedHabit = await this.habitRepository.save(habit);
    return savedHabit;
  }


  private buildHabitResponse(habit: Habit, event?: HabitEvent) {
    return {
      id: habit.id,
      name: habit.name,
      goal: habit.goal,
      unit: habit.unit,
      icon: habit.icon,
      value: event?.value ?? 0,
      isGoalCompleted: event?.isGoalCompleted ?? false,
      isFailure: event?.isFailure ?? false,
    };
  }


}
