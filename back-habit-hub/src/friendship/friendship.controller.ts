import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { JwtAuthGuard } from '../user_module/auth/jwt/jwt.guard';
import { User } from '../user_module/auth/jwt/user.decorator';

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

  @Get()
  findAllFriendships() {
    return this.friendshipService.findAll();
  }
}
