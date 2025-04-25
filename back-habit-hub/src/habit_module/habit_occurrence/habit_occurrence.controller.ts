import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common'
import { HabitOccurrenceService } from './habit_occurrence.service'
import { CreateHabitOccurrenceDto } from './dto/habit_occurrence.dto'

@Controller('habit-occurrence')
export class HabitOccurrenceController {
    constructor(
        private readonly habitOccurrenceService: HabitOccurrenceService
    ) {}
}
