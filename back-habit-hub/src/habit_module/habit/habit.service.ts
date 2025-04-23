import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { HabitDto } from './dto/habit.dto';
import { Habit } from './entities/habit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, MoreThan } from 'typeorm';
import { HabitCategoryConfig } from '../habit_unit_map';
import { HabitOccurrence } from '../habit_occurrence/entities/habit_occurrence.entity';
import { HabitEvent } from '../habit_event/entities/habit_event.entity';
import { HabitEventService } from '../habit_event/habit_event.service';
import { HabitScheduleService } from '../habit_schedule/habit_schedule.service';
import { HabitOccurrenceService } from '../habit_occurrence/habit_occurrence.service';
import { HabitPreviewResponseDto, HabitDetailedResponseDto, HabitDailyDataResponse } from './dto/response_habit.dto';
import { HabitStatus } from '../habit_enums';



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


  async createHabit(body: HabitDto, userId: string) {
    const habit = await this.createAndSaveHabit(body, userId);

    await this.habitScheduleService.createSchedule(habit, body.habitSchedule, body.habitScheduleData);
    const occurrences = this.habitOccurrenceService.generateOccurrences(habit, userId, body.habitSchedule, body.habitScheduleData);
    await this.habitOccurrenceRepository.save(occurrences);
    return {
      success: true,
      habitId: habit.id,
    };
  }


  async getUserHabitsByDate(userId: string, date: string): Promise<HabitPreviewResponseDto[]> {
    const dateObj = new Date(date);
    const userHabitOccurrences = await this.habitOccurrenceRepository.find({
      where: {
        user: { id: +userId },
        date: dateObj,
      },
      relations: ['user', 'habit'],
    });
    const habitIds = userHabitOccurrences.map((occurrence) => occurrence.habitId);
    if (!habitIds.length) return [];
    const habits = await this.habitRepository.find({
      where: { id: In(habitIds) },
      relations: ['events', 'habitSchedule'],
    });

    const isToday = this.habitEventService.isSameDay(dateObj, new Date());

    const eventMap = isToday
      ? await this.habitEventService.fetchOrCreateHabitEvents(habits, dateObj)
      : this.habitEventService.getExistingEventsForDate(habits, dateObj);

    return habits.map(habit => {
      const event = eventMap.get(habit.id);
      return this.buildHabitPreviewResponse(habit, event);
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


  async editHabit(habitId: number, userId: string, habitData: HabitDto) {
    const habit = await this.habitRepository.findOne({
      where: { id: habitId, user: { id: +userId } },
      relations: ['habitSchedule'],
    });

    if (!habit) throw new NotFoundException('Habit not found or access denied.');

    this.updateHabitFieldsByHabitData(habit, habitData)

    await this.habitRepository.save(habit)

    await this.habitScheduleService.updateSchedule(
      habit.habitSchedule,
      habitData.habitSchedule,
      habitData.habitScheduleData,
    );

    await this.habitOccurrenceRepository.delete({
      habit: { id: habit.id }
    });

    const newOccurrences = this.habitOccurrenceService.generateOccurrences(
      habit,
      userId,
      habitData.habitSchedule,
      habitData.habitScheduleData,
    );
    await this.habitOccurrenceRepository.save(newOccurrences);

    return habit;
  }


  async createAndSaveHabit(body: HabitDto, userId: string): Promise<Habit> {
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


  async getHabitById(habitId: number, userId: number): Promise<HabitDetailedResponseDto> {
    const habit = await this.habitRepository.findOne({
      where: {
        id: habitId,
        user: { id: userId }
      },
      relations: ['habitSchedule', 'events', 'habitOccurrence']
    });

    if (!habit) {
      throw new NotFoundException('Error getting habit data');
    }
    const response = this.buildHabitDetailedResponse(habit);
    return response
  }


  async countHabitProgressWithFine(habit: Habit) {
    const totalScheduledDays = habit.habitOccurrence?.length ?? 0;
    const allEvents = await this.habitEventService.findAllEventsByHabitId(habit.id);
    const totalLoggedValue = allEvents.reduce((sum, e) => sum + e.value, 0);
    const totalGoal = habit.goal * totalScheduledDays;
    let progress = totalGoal > 0 ? Math.min((totalLoggedValue / totalGoal) * 100, 100) : 0;

    const failedDays = this.getNumberOfFailedDays(habit.events)
    if (failedDays === 1) {
      progress = Math.max(progress - 20, 0);
    } else if (failedDays === 2) {
      progress = Math.max(progress - 50, 0);
    } else if (failedDays > 2) {
      progress = 0;
      habit.status = HabitStatus.ABANDONED;
    }
    habit.progress = Math.round(progress);
    await this.habitRepository.save(habit);
  }




  private buildHabitPreviewResponse(habit: Habit, event?: HabitEvent): HabitPreviewResponseDto {
    return {
      id: habit.id,
      name: habit.name,
      goal: habit.goal,
      unit: habit.unit,
      icon: habit.icon,
      value: event?.value ?? 0,
      category: habit.category,
      isGoalCompleted: event?.isGoalCompleted ?? false,
      isFailure: event?.isFailure ?? false,
      habitSchedule: {
        type: habit.habitSchedule?.type ?? null,
        daysOfWeek: habit.habitSchedule?.daysOfWeek ?? [],
        daysOfMonth: habit.habitSchedule?.daysOfMonth ?? [],
      },
    };
  }



  private buildHabitDetailedResponse(habit: Habit): HabitDetailedResponseDto {
    const totalValueQuantity = this.getTotalValue(habit);
    const totalNumberOfCompletedDays = this.getCompletedDays(habit);
    const habitDailyData = this.getHabitDailyData(habit);
    const numberOfFailedDays = this.getNumberOfFailedDays(habit.events);

    return {
      id: habit.id,
      name: habit.name,
      goal: habit.goal,
      unit: habit.unit,
      icon: habit.icon,
      category: habit.category,
      startDate: habit.startDate,
      goalDuration: habit.goalDuration,
      goalPeriodicity: habit.goalPeriodicity,
      status: habit.status,
      progress: habit.progress,
      totalValueQuantity: totalValueQuantity,
      totalNumberOfCompletedDays: totalNumberOfCompletedDays,
      habitSchedule: {
        type: habit.habitSchedule?.type ?? null,
        daysOfWeek: habit.habitSchedule?.daysOfWeek ?? [],
        daysOfMonth: habit.habitSchedule?.daysOfMonth ?? [],
      },
      habitDailyData: habitDailyData,
      numberOfFailedDays: numberOfFailedDays,
    };
  }


  private getNumberOfFailedDays(events: HabitEvent[]): number {
    return events.filter(e => e.isFailure == true).length;
  }


  private getTotalValue(habit: Habit): number {
    return habit.events.reduce((sum, e) => sum + (e.value || 0), 0);
  }


  private getCompletedDays(habit: Habit): number {
    return habit.events.filter(e => e.isGoalCompleted).length;
  }


  private getHabitDailyData(habit: Habit): HabitDailyDataResponse[] {
    const eventMap = new Map<string, { isGoalCompleted: boolean; value: number }>();

    habit.events.map(event => {
      const key = new Date(event.date).toISOString().split('T')[0];
      eventMap.set(key, {
        isGoalCompleted: event.isGoalCompleted,
        value: event.value,
      });
    });

    return habit.habitOccurrence.map(occurrence => {
      const dateKey = new Date(occurrence.date).toISOString().split('T')[0];
      const eventData = eventMap.get(dateKey);
      return {
        date: occurrence.date,
        isGoalCompleted: eventData?.isGoalCompleted ?? false,
        value: eventData?.value ?? 0,
      };
    });
  }



  private updateHabitFieldsByHabitData(habit: Habit, habitData: HabitDto) {
    const fieldsToUpdate: (keyof HabitDto)[] = [
      'name',
      'goal',
      'goalDuration',
      'unit',
      'icon',
      'goalPeriodicity',
      'startDate',
      'category',
    ];

    for (const key of fieldsToUpdate) {
      const newValue = key === 'startDate'
        ? new Date(habitData.startDate)
        : habitData[key];

      if (habit[key] !== newValue) {
        habit[key] = newValue as any;
      }
    }
  }
}
