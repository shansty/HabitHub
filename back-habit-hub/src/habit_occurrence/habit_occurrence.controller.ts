import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HabitOccurrenceService } from './habit_occurrence.service';
import { CreateHabitOccurrenceDto } from './dto/create-habit_occurrence.dto';

@Controller('habit-occurrence')
export class HabitOccurrenceController {
  constructor(private readonly habitOccurrenceService: HabitOccurrenceService) {}

  @Post()
  create(@Body() createHabitOccurrenceDto: CreateHabitOccurrenceDto) {
    return this.habitOccurrenceService.create(createHabitOccurrenceDto);
  }

}
