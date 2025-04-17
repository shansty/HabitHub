import { UnitOfMeasurement, Schedule, GoalPeriodicity } from "./enums"

export type User = {
    username: string,
    password?: string,
    email?: string,
    profile_picture?: File | string | undefined
}

export type UserProfile = {
    username?: string,
    profile_picture?: File | string | undefined
}

export type ResetPasswordCredentials = {
    email: string,
    new_password: string,
    confirm_password: string,
}

export type CategoryData = {
    name: string;
    icons: string[];
    defaultIcon: string;
    defaultUnit: UnitOfMeasurement;
    allowedUnits: UnitOfMeasurement[];
}

export type HabitCreateData = {
    name: string;
    goal: number;
    goalDuration: number;
    unit: UnitOfMeasurement;
    icon: string;
    habitSchedule: Schedule;
    habitScheduleData: {
        daysOfWeek: number[];
        daysOfMonth: number[];
    };
    goalPeriodicity: GoalPeriodicity;
    startDate: Date;
    category: string;
};

export type UsersHabitData = {
    id: number,
    name: string,
    goal: number,
    unit: UnitOfMeasurement,
    icon: string,
    value: number,
    isGoalCompleted: boolean,
    isFailure: boolean,
    category?: string,
    habitSchedule: {
        type: Schedule;
        daysOfWeek: number[];
        daysOfMonth: number[];
    };
}

export type HabitEvent = {
    habitId: number,
    date: string,
    value?: number,
    isGoalCompleted?: boolean,
    isFailure?: boolean,
}

