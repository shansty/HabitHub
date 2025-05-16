import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Friendship } from './entities/friendship.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { NotificationService } from '../notification/notification.service';
import { FriendshipStatus } from './friendship_enum';
import { FriendshipPreviewDto } from './dto/friendship_preview.dto';
@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    private readonly notificationService: NotificationService,
  ) { }


  async sendFriendRequest(createFriendshipDto: CreateFriendshipDto, userId: string): Promise<{ success: boolean }> {
    const { senderId, receiverId } = createFriendshipDto;
    if (senderId != Number(userId)) {
      throw new ForbiddenException("Another user cannot send friend requests")
    }
    const [user1Id, user2Id] = senderId < receiverId
      ? [senderId, receiverId]
      : [receiverId, senderId];
    const existingFriendship = await this.friendshipRepository.findOne({
      where: {
        user1: { id: user1Id },
        user2: { id: user2Id },
      },
    });
    if (existingFriendship?.status == FriendshipStatus.PENDING) {
      throw new BadRequestException('Waiting for friend request to be accepted.');
    }
    if (existingFriendship?.status == FriendshipStatus.REJECTED) {
      existingFriendship.status = FriendshipStatus.PENDING
      await this.friendshipRepository.save(existingFriendship);
      await this.notificationService.notifyFriendRequest(senderId, receiverId)
      return { success: true };
    }
    if (existingFriendship?.status == FriendshipStatus.ACCEPTED) {
      throw new BadRequestException('You are already friends.');
    }
    const friendship = this.friendshipRepository.create({
      user1: { id: user1Id },
      user2: { id: user2Id },
      status: FriendshipStatus.PENDING
    });
    await this.friendshipRepository.save(friendship);
    await this.notificationService.notifyFriendRequest(senderId, receiverId)
    return { success: true };
  }


  async getUserFriendsPaginated(userId: string, page: number = 1, limit: number = 3): Promise<{ friends: FriendshipPreviewDto[]; nextPage: number | null }> {
    const skip = (page - 1) * limit;
    const [friendships, total] = await this.friendshipRepository.findAndCount({
      where: [
        { user1: { id: +userId }, status: FriendshipStatus.ACCEPTED },
        { user2: { id: +userId }, status: FriendshipStatus.ACCEPTED },
      ],
      relations: ['user1', 'user2'],
      order: {
        updated_at: 'DESC',
      },
      take: limit,
      skip,
    });
    const friends = friendships.map((friendship) => {
      const friend = friendship.user1.id === +userId ? friendship.user2 : friendship.user1;
      return {
        id: friend.id,
        username: friend.username,
        status: friendship.status
      };
    });
    const hasMore = friends.length === limit;
    const nextPage = hasMore ? page + 1 : null;
    return { friends, nextPage };
  }



  async deleteUserFriend(userId: string, friendId: string): Promise<{ success: boolean }> {
    const [user1Id, user2Id] = this.getUserIdsOrder(+userId, +friendId);
    const friendship = await this.friendshipRepository.findOne({
      where: {
        user1: { id: user1Id },
        user2: { id: user2Id },
      },
    });
    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }
    await this.friendshipRepository.remove(friendship);
    return { success: true }
  }


  getUserIdsOrder(id1: number, id2: number): [number, number] {
    return id1 < id2 ? [id1, id2] : [id2, id1];
  }


  async areFriends(userId1: number, userId2: number): Promise<boolean> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { user1: { id: userId1 }, user2: { id: userId2 }, status: FriendshipStatus.ACCEPTED },
        { user1: { id: userId2 }, user2: { id: userId1 }, status: FriendshipStatus.ACCEPTED },
      ],
    });
    return !!friendship;
  }


  async getFriendIdsForUser(userId: number): Promise<number[]> {
    const friendships = await this.friendshipRepository.find({
      where: [
        { user1: { id: userId }, status: FriendshipStatus.ACCEPTED },
        { user2: { id: userId }, status: FriendshipStatus.ACCEPTED },
      ],
      relations: ['user1', 'user2'],
    });

    return friendships.map(friendship => {
      return friendship.user1.id === userId
        ? friendship.user2.id
        : friendship.user1.id;
    });
  }


  async getFriendshipWithAnyStatus(senderId: number, recipientId: number): Promise<Friendship | null> {
    const [id1, id2] = this.getUserIdsOrder(senderId, recipientId)
    return await this.friendshipRepository.findOne({
      where: {
        user1: { id: id1 },
        user2: { id: id2 }
      },
      relations: ['user1', 'user2'],
    })
  }


  async saveFriendship(friendship: Friendship): Promise<void> {
    await this.friendshipRepository.save(friendship);
  }
}