import { IsDateString, IsInt, IsBoolean, IsNotEmpty } from 'class-validator'

export class HabitEventDto {
    @IsInt()
    habitId: number

    @IsDateString(
        {},
        { message: 'Date must be a valid ISO string (yyyy-mm-dd).' }
    )
    date: string

    @IsInt({ message: 'Value must be an integer.' })
    value: number

    @IsBoolean({ message: 'isGoalCompleted must be a boolean.' })
    isGoalCompleted: boolean

    @IsBoolean({ message: 'isFailure must be a boolean.' })
    isFailure: boolean
}
