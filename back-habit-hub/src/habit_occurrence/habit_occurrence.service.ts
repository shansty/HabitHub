import { Injectable } from '@nestjs/common';
import { CreateHabitOccurrenceDto } from './dto/create-habit_occurrence.dto';

@Injectable()
export class HabitOccurrenceService {
  create(createHabitOccurrenceDto: CreateHabitOccurrenceDto) {
    return 'This action adds a new habitOccurrence';
  }

}
