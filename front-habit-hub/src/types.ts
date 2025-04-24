import { UnitOfMeasurement, Schedule, GoalPeriodicity, HabitStatus } from "./enums"

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

export type UsersHabitPreviewResponseData = {
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
    },
}

export type UsersHabitDetailedResponseData = {
    id: number,
    name: string,
    goal: number,
    unit: UnitOfMeasurement,
    icon: string,
    category: string,
    status: HabitStatus
    habitSchedule: {
        type: Schedule;
        daysOfWeek: number[];
        daysOfMonth: number[];
    },
    startDate: Date,
    goalDuration: number,   
    goalPeriodicity: GoalPeriodicity,
    totalValueQuantity: number,
    totalNumberOfCompletedDays: number,
    habitDailyData:HabitDailyDataResponse[],
    numberOfFailedDays: number,
    progress: number
}


export type HabitDailyDataResponse = {
    date: Date,
    isGoalCompleted: boolean,
    value: number
}


export type HabitEvent = {
    habitId: number,
    date: string,
    value?: number,
    isGoalCompleted?: boolean,
    isFailure?: boolean,
}

