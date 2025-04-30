import { CanActivate, ExecutionContext, Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { FriendshipService } from '../friendship.service';

@Injectable()
export class FriendshipGuard implements CanActivate {
  constructor(private readonly friendshipService: FriendshipService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const currentUserId = +request.user.userId; 
    const targetUserId = +request.params.friendId; 

    if (currentUserId === targetUserId) return true; 

    const areFriends = await this.friendshipService.areFriends(currentUserId, targetUserId);
    if (!areFriends) {
      throw new ForbiddenException('You are not allowed to view this user\'s data.');
    }
    return true;
  }
}
