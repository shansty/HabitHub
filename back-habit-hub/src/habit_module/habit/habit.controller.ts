import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common'
import { HabitService } from './habit.service'
import { HabitDto } from './dto/habit.dto'
import { JwtAuthGuard } from '../../user_module/auth/jwt_guard/jwt.guard'
import { User } from '../../user_module/auth/jwt_guard/user.decorator'
import { FriendshipGuard } from '../../friendship/friendship_guard/friendship.guard'

@Controller('habit')
export class HabitController {
    constructor(private readonly habitService: HabitService) { }

    @UseGuards(JwtAuthGuard)
    @Get('categories')
    getCategories() {
        return this.habitService.getHabitCategories()
    }


    @UseGuards(JwtAuthGuard)
    @Post()
    createHabit(@Body() body: HabitDto, @User('userId') userId: string) {
        return this.habitService.createHabit(body, userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getUserHabitsByDate(
        @User('userId') userId: string,
        @Query('date') date: string
    ) {
        return this.habitService.getUserHabitsByDate(userId, date)
    }


    @UseGuards(JwtAuthGuard, FriendshipGuard)
    @Get('friend/:friendId')
    getFriendHabitsByDate(
        @User('userId') userId: string,
        @Param('friendId') friendId: string,
        @Query('date') date: string,
    ) {
        return this.habitService.getUserHabitsByDate(friendId, date);
    }


    @Delete(':habitId')
    @UseGuards(JwtAuthGuard)
    deleteHabit(
        @Param('habitId') habitId: string,
        @User('userId') userId: string
    ) {
        return this.habitService.deleteHabit(+habitId, +userId)
    }

    @Patch(':habitId')
    @UseGuards(JwtAuthGuard)
    editHabit(
        @Param('habitId') habitId: string,
        @User('userId') userId: string,
        @Body() habitData: HabitDto
    ) {
        return this.habitService.editHabit(+habitId, userId, habitData)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getHabitById(@Param('id') habitId: string, @User('userId') userId: string) {
        return this.habitService.getHabitByIdAndUserId(+habitId, +userId)
    }

    @Patch(':habitId/attempt')
    @UseGuards(JwtAuthGuard)
    startNewAttempt(
        @User('userId') userId: string,
        @Param('habitId') habitId: string,
        @Body('date') date: string
    ) {
        return this.habitService.startNewHabitAttempt(+habitId, date, userId)
    }
}
