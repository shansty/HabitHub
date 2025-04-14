import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { Habit } from './entities/habit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { HabitCategoryConfig } from './utils/habit-unit-map';
import { HabitOccurrence } from '../habit_occurrence/entities/habit_occurrence.entity';
import { HabitSchedule } from '../habit_schedule/entities/habit_schedule.entity';
import { HabitScheduleType } from './utils/habit_enums';
import { HabitEvent } from '../habit_event/entities/habit_event.entity';



@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(HabitOccurrence)
    private readonly habitOccurrenceRepository: Repository<HabitOccurrence>,
    @InjectRepository(HabitSchedule)
    private readonly habitScheduleRepository: Repository<HabitSchedule>,
    @InjectRepository(HabitEvent)
    private readonly habitEventRepository: Repository<HabitEvent>,
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
    const user = await this.userRepository.findOneBy({ id: +userId });
    if (!user) {
      throw new UnauthorizedException("You must be authorized to add a new habit.");
    }

    const habit = this.habitRepository.create({
      name: body.name,
      goal: body.goal,
      goalDuration: body.goalDuration,
      unit: body.unit,
      icon: body.icon,
      goalPeriodicity: body.goalPeriodicity,
      startDate: body.startDate,
      category: body.category,
      user: { id: +userId }
    });
    const savedHabit = await this.habitRepository.save(habit);

    const habitSchedule = this.habitScheduleRepository.create({
      habit: savedHabit,
      type: body.habitSchedule,
      daysOfWeek: body.habitSchedule === HabitScheduleType.DAILY ? body.habitScheduleData.daysOfWeek : [],
      daysOfMonth: body.habitSchedule === HabitScheduleType.MONTHLY ? body.habitScheduleData.daysOfMonth : [],
    });

    await this.habitScheduleRepository.save(habitSchedule);

    const habitOccurence: HabitOccurrence[] = [];
    const start = new Date(body.startDate);

    for (let i = 0; i < body.goalDuration; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      const isValidDay = this.shouldIncludeDate(
        currentDate,
        body.habitSchedule,
        {
          daysOfWeek: body.habitScheduleData.daysOfWeek,
          daysOfMonth: body.habitScheduleData.daysOfMonth,
        }
      );

      if (isValidDay) {
        habitOccurence.push(
          this.habitOccurrenceRepository.create({
            date: currentDate,
            user: user,
            userId: user.id,
            habit: savedHabit,
            habitId: savedHabit.id,
          })
        );
      }
    }
    await this.habitOccurrenceRepository.save(habitOccurence);
    return {
      success: true,
      habitId: savedHabit.id,
    };
  }



  async getUserHabitsByDate(userId: string, date: string) {

    const userHabits = await this.habitOccurrenceRepository.findBy({
      userId: +userId,
      date: new Date(date),
    });

    const habitIds = userHabits.map((habit) => habit.habitId);
    if (!habitIds.length) return [];

    const habits = await this.habitRepository.find({
      where: {
        id: In(habitIds),
      },
    });

    const existingHabitEvents = await this.habitEventRepository.find({
      where: {
        habitId: In(habitIds),
        date: new Date(date),
      },
    });

    const eventsMap = new Map<number, HabitEvent>();
    for (const event of existingHabitEvents) {
      eventsMap.set(event.habitId, event);
    }

    const habitsMissingEvents = habits.filter(habit => !eventsMap.has(habit.id));

    const isToday = this.isSameDay(new Date(date), new Date())

    if (habitsMissingEvents.length > 0 && isToday) {
      const newEvents = habitsMissingEvents.map(habit => {
        const newEvent = this.habitEventRepository.create({
          habitId: habit.id,
          date: new Date(date),
          value: 0,
          isGoalCompleted: false,
          isFailure: false,
        });
        return newEvent;
      });

      const savedEvents = await this.habitEventRepository.save(newEvents);

      for (const event of savedEvents) {
        eventsMap.set(event.habitId, event);
      }
    }

    const userHabitsWithEvents = habits.map((habit) => {
      const event = eventsMap.get(habit.id);

      const habitWithEvent = {
        id: habit.id,
        name: habit.name,
        goal: habit.goal,
        unit: habit.unit,
        icon: habit.icon,
        value: event?.value ?? 0,
        isGoalCompleted: event?.isGoalCompleted ?? false,
        isFailure: event?.isFailure ?? false,
      };

      return habitWithEvent;
    });

    return userHabitsWithEvents;
  }


  async deleteHabit(habitId: number, userId: number): Promise<{ success: boolean }> {
    console.dir({
      habitId, userId
    })
    const habit = await this.habitRepository.findOne({
      where: { id: habitId, user: { id: userId } },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found or does not belong to the user');
    }

    await this.habitRepository.remove(habit);

    return { success: true };
  }




  private shouldIncludeDate(date: Date, schedule: HabitScheduleType, data: { daysOfWeek?: number[]; daysOfMonth?: number[] }): boolean {
    const jsDay = date.getDay();
    const mappedDay = jsDay === 0 ? 7 : jsDay;
    const dayOfMonth = date.getDate();
    if (schedule === HabitScheduleType.DAILY) {
      return data.daysOfWeek?.includes(mappedDay) ?? false;
    }
    if (schedule === HabitScheduleType.MONTHLY) {
      return data.daysOfMonth?.includes(dayOfMonth) ?? false;
    }
    return false;
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
}
