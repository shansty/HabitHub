import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HabitScheduleService } from './habit_schedule.service';
import { CreateHabitScheduleDto } from './dto/create-habit_schedule.dto';

@Controller('habit-schedule')
export class HabitScheduleController {
  constructor(private readonly habitScheduleService: HabitScheduleService) {}

}
