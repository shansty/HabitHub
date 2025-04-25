import { Controller, Body, Patch, Param, UseGuards } from '@nestjs/common'
import { HabitEventService } from './habit_event.service'
import { JwtAuthGuard } from '../../user_module/auth/jwt/jwt.guard'
@Controller('habit-event')
export class HabitEventController {
    constructor(private readonly habitEventService: HabitEventService) {}

    @Patch(':habitId')
    @UseGuards(JwtAuthGuard)
    addEventValue(
        @Param('habitId') habitId: number,
        @Body('logValue') logValue: number,
        @Body('date') date: string
    ) {
        return this.habitEventService.addEventValue(habitId, logValue, date)
    }
}
