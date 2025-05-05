import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { JwtAuthGuard } from '../user_module/auth/jwt_guard/jwt.guard';
import { User } from '../user_module/auth/jwt_guard/user.decorator';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  sendFriendRequest(
    @Body() createFriendshipDto: CreateFriendshipDto,
    @User('userId') userId: string) {
    return this.friendshipService.sendFriendRequest(createFriendshipDto, userId);
  }

  @Patch('accept')
  acceptFriendRequest(@Body() updateFriendshipDto: CreateFriendshipDto) {
    return this.friendshipService.acceptFriendRequest(updateFriendshipDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserFriendsPaginated(
    @User('userId') userId: string,
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    return this.friendshipService.getUserFriendsPaginated(userId, pageNum, limitNum);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':friendId')
  deleteUserFriend(
    @User('userId') userId: string,
    @Param('friendId') friendId: string
  ) {
    return this.friendshipService.deleteUserFriend(userId, friendId);
  }
}
