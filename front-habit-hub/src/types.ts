import { UnitOfMeasurementEnum, HabitScheduleEnum, GoalPeriodicityEnum } from "./enums"

export type TypeUser = {
    username: string,
    password?: string,
    email?: string,
    profile_picture?: File | string | undefined
}

export type TypeUserProfile = {
    username?: string,
    profile_picture?: File | string | undefined
}

export type TypeResetPasswordCredentials = {
    email: string,
    new_password: string,
    confirm_password: string,
}

export type TypeHabitWithProgress = {
    id: number,
    name: string;
    category: string;
    progress: number
}

export type TypeCategoryConfig = {
    name: string;
    icons: string[];
    defaultIcon: string;
    defaultUnit: UnitOfMeasurementEnum;
    allowedUnits: UnitOfMeasurementEnum[];
}

export type TypeHabitFormState = {
    name: string;
    goal: string;
    goalDuration: string;
    unit: UnitOfMeasurementEnum;
    icon: string;
    habitSchedule: HabitScheduleEnum;
    habitScheduleData: {
        daysOfWeek: number[];
        daysOfMonth: number[];
    };
    goalPeriodicity: GoalPeriodicityEnum;
    startDate: Date;
    category: string;
};



export type TypeHabitCreateData = {
    name: string;
    goal: number;
    goalDuration: number;
    unit: UnitOfMeasurementEnum;
    icon: string;
    habitSchedule: HabitScheduleEnum;
    habitScheduleData: {
        daysOfWeek: number[];
        daysOfMonth: number[];
    };
    goalPeriodicity: GoalPeriodicityEnum;
    startDate: string;
    category: string;
};


export type TypeUserHabitsList = {
    id: number,
    name: string,
    goal: number,
    unit: string,
    icon: string,
    value: number,
    isGoalCompleted: boolean,
    isFailure: boolean

  }
  
export type TypeHabitEvent = {
    habitId: number,
    date: string,
    value?: number,
    isGoalCompleted?: boolean,
    isFailure?: boolean,
}
