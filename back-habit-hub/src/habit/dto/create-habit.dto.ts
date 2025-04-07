import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { HabitCategory } from "../utils/habit-category-icons";

export class CreateHabitDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEnum(HabitCategory)
    category: HabitCategory;
}
