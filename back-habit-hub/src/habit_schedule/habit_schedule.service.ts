import { Injectable } from '@nestjs/common';
import { CreateHabitScheduleDto } from './dto/create-habit_schedule.dto';

@Injectable()
export class HabitScheduleService {
  create(createHabitScheduleDto: CreateHabitScheduleDto) {
    return 'This action adds a new habitSchedule';
  }

}
