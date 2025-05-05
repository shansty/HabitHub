import {
    Schedule,
    HabitDomain,
    UnitOfMeasurement,
    GoalPeriodicity,
    HabitStatus,
} from '../../habit_enums'
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CookieOptions } from 'express'

class HabitScheduleResponse {
    @IsEnum(Schedule)
    @IsOptional()
    type: Schedule | null

    @IsNumber({}, { each: true })
    daysOfWeek: number[]

    @IsNumber({}, { each: true })
    daysOfMonth: number[]
}

export class HabitDailyDataResponse {
    @IsDate()
    date: Date

    @IsBoolean()
    isGoalCompleted: boolean

    @IsNumber()
    value: number
}

export class HabitPreviewResponseDto {
    @IsNumber()
    id: number

    @IsString()
    name: string

    @IsNumber()
    goal: number

    @IsEnum(UnitOfMeasurement)
    unit: UnitOfMeasurement

    @IsString()
    icon: string

    @IsNumber()
    value?: number

    @IsEnum(HabitDomain)
    category: HabitDomain

    @IsNumber()
    progress: number

    @IsBoolean()
    isGoalCompleted: boolean

    @IsBoolean()
    isFailure: boolean

    @ValidateNested()
    @Type(() => HabitScheduleResponse)
    habitSchedule: HabitScheduleResponse
}

export class HabitDetailedResponseDto {
    @IsNumber()
    id: number

    @IsString()
    name: string

    @IsNumber()
    goal: number

    @IsEnum(UnitOfMeasurement)
    unit: UnitOfMeasurement

    @IsString()
    icon: string

    @IsEnum(HabitDomain)
    category: HabitDomain

    @IsEnum({ type: 'enum', enum: HabitStatus })
    status: HabitStatus

    @IsDate()
    startDate: Date

    @IsDate()
    attemptStartDate: Date

    @IsNumber()
    goalDuration: number

    @IsEnum({ type: 'enum', enum: GoalPeriodicity })
    goalPeriodicity: GoalPeriodicity

    @IsNumber()
    totalValueQuantity: number

    @IsNumber()
    totalNumberOfCompletedDays: number

    @IsNumber()
    numberOfFailedDays: number

    @IsNumber()
    progress: number

    @IsNumber()
    attemp: number

    @ValidateNested({ each: true })
    @Type(() => HabitDailyDataResponse)
    @IsArray()
    habitDailyData: HabitDailyDataResponse[]

    @ValidateNested()
    @Type(() => HabitScheduleResponse)
    habitSchedule: HabitScheduleResponse
}
