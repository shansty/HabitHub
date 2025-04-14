import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEvent } from './entities/habit_event.entity';
import { CreateHabitEventDto } from './dto/create-habit_event.dto';
import { Habit } from '..//habit/entities/habit.entity';

@Injectable()
export class HabitEventService {
  constructor(
    @InjectRepository(HabitEvent)
    private habitEventRepository: Repository<HabitEvent>,

    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
  ) {}


  async findOrCreateEmptyEvent(body: CreateHabitEventDto): Promise<HabitEvent> {
    const { habitId, date } = body;

    const existingHabitEvent = await this.habitEventRepository.findOneBy({
      habitId: +habitId,
      date: new Date(date)
    });

    if (existingHabitEvent) {
      return existingHabitEvent;
    }

    const habit = await this.habitRepository.findOneBy({ id: habitId });
    if (!habit) throw new NotFoundException('Habit not found');

    const newEvent = this.habitEventRepository.create({
      habitId,
      date,
      habit,
      value: 0,
      isGoalCompleted: false,
      isFailure: false,
    });

    await this.habitEventRepository.save(newEvent)

    return newEvent;
  }
}
