import { Controller } from '@nestjs/common';
import { HabitScheduleService } from './habit_schedule.service';

@Controller('habit-schedule')
export class HabitScheduleController {
  constructor(private readonly habitScheduleService: HabitScheduleService) {}

}
