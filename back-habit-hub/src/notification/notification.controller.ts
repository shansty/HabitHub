import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../user_module/auth/jwt_guard/jwt.guard';
import { User } from '../user_module/auth/jwt_guard/user.decorator';
import { RespondFriendRequestDto } from './dto/respond_friend_request.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserNotifications(
    @User('userId') userId: string,
    @Query('page') page: string,
    @Query('limit') limit: string) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    return this.notificationService.getUsersNotifications(+userId, pageNum, limitNum);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':notificationId')
  async respondToFriendRequest(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Body() body: RespondFriendRequestDto
  ) {
    return this.notificationService.respondToFriendRequest(notificationId, body);
  }
}
