import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HabitEventService } from './habit_event.service';
import { CreateHabitEventDto } from './dto/create-habit_event.dto';

@Controller('habit-event')
export class HabitEventController {
  constructor(private readonly habitEventService: HabitEventService) { }

  // @Post()
  // async findOrCreateEmptyEvent(@Body() body: CreateHabitEventDto) {
  //   return this.habitEventService.findOrCreateEmptyEvent(body);
  // }
}
