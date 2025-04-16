import { IsString, IsNotEmpty, IsEnum,IsNumber, Min, Max, IsDateString, IsOptional, IsArray, IsInt, ValidateIf, ValidateNested} from "class-validator";
import { Type } from "class-transformer";
import {UnitOfMeasurementType, GoalPeriodicityType, HabitScheduleType, HabitDomain} from "../utils/habit_enums";

class HabitScheduleData {
  @ValidateIf((_, value) => Array.isArray(value))
  @IsOptional()
  @IsArray({ message: 'Days of the week must be an array of numbers.' })
  @IsInt({ each: true, message: 'Each day must be an integer.' })
  @Min(1, { each: true, message: 'Day must be between 1 and 7.' })
  @Max(7, { each: true, message: 'Day must be between 1 and 7.' })
  daysOfWeek?: number[];

  @ValidateIf((_, value) => Array.isArray(value))
  @IsOptional()
  @IsArray({ message: 'Days of the month must be an array of numbers.' })
  @IsInt({ each: true, message: 'Each date must be an integer.' })
  @Min(1, { each: true, message: 'Date must be between 1 and 31.' })
  @Max(31, { each: true, message: 'Date must be between 1 and 31.' })
  daysOfMonth?: number[];
}

export class HabitDto {
  @IsString({ message: 'Habit name must be a valid string. ' })
  @IsNotEmpty({ message: 'Please enter a name for your habit. ' })
  name: string;

  @IsNumber({}, { message: 'Goal must be a number. ' })
  @Min(1, { message: 'Goal must be at least 1. ' })
  goal: number;

  @IsNumber({}, { message: 'Duration must be a number. ' })
  @Min(1, { message: 'Goal duration must be at least 1 day. ' })
  goalDuration: number;

  @IsEnum(UnitOfMeasurementType, {
    message: 'Please select a valid unit of measurement. '
  })
  unit: UnitOfMeasurementType;

  @IsString({ message: 'Icon must be a string. ' })
  @IsNotEmpty({ message: 'Please select an icon for your habit. ' })
  icon: string;

  @IsEnum(HabitScheduleType, {
    message: 'Please choose a valid repeat schedule. '
  })
  habitSchedule: HabitScheduleType;

  @ValidateNested()
  @Type(() => HabitScheduleData)
  habitScheduleData: HabitScheduleData;

  @IsEnum(GoalPeriodicityType, {
    message: 'Please select how often you want to complete your goal. '
  })
  goalPeriodicity: GoalPeriodicityType;

  @IsDateString({}, { message: 'Please provide a valid start date. ' })
  startDate: string;

  @IsEnum(HabitDomain, {
    message: 'Please choose a valid category from the list.'
  })
  category: HabitDomain;
}
