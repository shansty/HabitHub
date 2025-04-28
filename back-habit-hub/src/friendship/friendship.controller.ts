import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  sendFriendRequest(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipService.sendFriendRequest(createFriendshipDto);
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
