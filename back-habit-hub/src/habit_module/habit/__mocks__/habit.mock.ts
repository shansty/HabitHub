import {
    GoalPeriodicity,
    HabitDomain,
    Schedule,
    UnitOfMeasurement,
    HabitStatus,
} from "../../../habit_module/habit_enums";

import { Habit } from "../entities/habit.entity";
import { HabitSchedule } from "../../habit_schedule/entities/habit_schedule.entity";
import { HabitEvent } from "../../habit_event/entities/habit_event.entity";


const mockSchedule: HabitSchedule = {
    id: 1,
    type: Schedule.DAILY,
    daysOfWeek: [1, 3, 5],
    daysOfMonth: [],
    habit: {} as any, 
};


export const mockHabit: Habit = {
    id: 1,
    name: "Drink Water",
    goal: 8,
    isCompleted: false,
    isFailed: false,
    unit: UnitOfMeasurement.ITEMS,
    goalPeriodicity: GoalPeriodicity.PER_WEEK,
    goalDuration: 21,
    icon: "💧",
    category: HabitDomain.HEALTH,
    progress: 4,
    habitSchedule: mockSchedule,
    habitOccurrence: [],
    startDate: new Date("2024-01-01"),
    attemptStartDate: new Date("2024-01-01"),
    events: [],
    status: HabitStatus.IN_PROGRESS,
    user: {} as any,
    penalizedFailedDays: 0,
    attempt: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
};


export const mockEvent: HabitEvent = {
    id: 1,
    habit: mockHabit,
    habitId: mockHabit.id,
    date: new Date("2024-01-01"),
    value: 5,
    habitAttempt: 1,
    isGoalCompleted: true,
    isFailure: false,
    createdAt: new Date(),
};


export const mockHabitWithoutEvent: Habit = {
    ...mockHabit,
    id: 2,
    name: "Walk",
    goal: 10000,
    unit: UnitOfMeasurement.STEPS, 
    icon: "🚶‍♂️",
    category: HabitDomain.FITNESS,
    progress: 0,
    events: [],
};
