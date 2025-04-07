import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto'
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { User } from '../auth/jwt/user.decorator';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  createHabit(
    @Body() habit: CreateHabitDto,
    @User('userId') userId: string
  ) {
    return this.habitService.createHabit(habit, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('category')
  getAllCategories() {
    return this.habitService.getAllCategories();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.habitService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.habitService.remove(+id);
  // }
}
