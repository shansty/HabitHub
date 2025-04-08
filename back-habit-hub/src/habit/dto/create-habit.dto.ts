import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { HabitCategory } from "../utils/habit_enums";

export class CreateHabitDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEnum(HabitCategory)
    category: HabitCategory;
}
