import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { Habit } from './entities/habit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitCategory, HabitCategoryIcons, HabitStatus } from './utils/habit_enums';
import { User } from '../users/entities/users.entity';

@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }


  async createHabit(habit: CreateHabitDto, userId: string) {
  //   const user = await this.userRepository.findOneBy({ id: +userId})
  //   if(!user) {
  //     throw new UnauthorizedException("You must be authorized to add a new hobby.")
  //   }
  //   const newHabit = this.habitRepository.create({
  //     name: habit.name,
  //     category: habit.category,
  //     startDate: new Date(),
  //     user: user,
  //     userId: +userId,
  //     status: HabitStatus.IN_PROGRESS,
  //   });
  //   const savedHabit = await this.habitRepository.save(newHabit);

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

    return {success: true}
  }

  getAllCategories() {
    const categories = Object.values(HabitCategory).map((category) => ({
      name: category,
      icon: HabitCategoryIcons[category],
    }));

    return { categories: categories };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} habit`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} habit`;
  // }
}
