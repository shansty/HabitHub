import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { Habit } from './entities/habit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitCategory, HabitCategoryIcons } from './utils/habit-category-icons';
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
    console.dir({ habit })
    const user = await this.userRepository.findOneBy({ id: +userId})
    console.dir({user})
    if(!user) {
      throw new UnauthorizedException("You must be authorized to add a new hobby.")
    }
    const newHabit = await this.habitRepository.create({
      name: habit.name,
      category: habit.category,
      startDate: new Date(),
      user: user,
      userId: +userId
    });
    await this.habitRepository.save(newHabit);
    console.log(newHabit)
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
