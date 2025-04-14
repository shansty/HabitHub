import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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
    @Body() body: CreateHabitDto,
    @User('userId') userId: string
  ) {
    return this.habitService.createHabit(body, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserHabitsByDate(
    @User('userId') userId: string,
    @Query('date') date: string
  ) {
    return this.habitService.getUserHabitsByDate(userId, date)
  }

  @UseGuards(JwtAuthGuard)
  @Get('categories')
  getCategories() {
    return this.habitService.getHabitCategories();
  }

  @Delete(':habitId')
  @UseGuards(JwtAuthGuard) 
  deleteHabit(
    @Param('habitId') habitId: string,
    @User('userId') userId: string
  ) {
    return this.habitService.deleteHabit(+habitId, +userId);
  }
}
