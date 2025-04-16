import { Controller, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { HabitEventService } from './habit_event.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
@Controller('habit-event')
export class HabitEventController {
  constructor(private readonly habitEventService: HabitEventService) { }


  @Patch(':habitId')
  @UseGuards(JwtAuthGuard)
  addEventValue(
    @Param('habitId') habitId: number,
    @Body('logValue') logValue: number,
  ) {
    return this.habitEventService.addEventValue(habitId, logValue);
  }
}
