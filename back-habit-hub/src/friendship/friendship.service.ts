import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Friendship } from './entities/friendship.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { User } from 'src/user_module/users/entities/users.entity';


@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>
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

    if (existingFriendship) {
      throw new BadRequestException('Waiting for friend request to be accepted.');
    }

    const friendship = this.friendshipRepository.create({
      user1: { id: user1Id },
      user2: { id: user2Id },
      isAccepted: false,
    });

    await this.friendshipRepository.save(friendship);
    return { success: true };
  }


  async acceptFriendRequest(createFriendshipDto: CreateFriendshipDto) {
    const { senderId, receiverId } = createFriendshipDto;
    const [user1Id, user2Id] = this.getUserIdsOrder(senderId, receiverId);
    const friendship = await this.friendshipRepository.findOne({
      where: {
        user1: { id: user1Id },
        user2: { id: user2Id },
      },
    });

    if (!friendship) {
      throw new BadRequestException('No friend request found.');
    }

    friendship.isAccepted = true;
    await this.friendshipRepository.save(friendship);

    return friendship;
  }


  async getUserFriendsPaginated(userId: string, page: number = 1, limit: number = 3): Promise<{ friends: { id: number; username: string }[]; nextPage: number | null }> {
    const skip = (page - 1) * limit;
    const [friendships, total] = await this.friendshipRepository.findAndCount({
      where: [
        { user1: { id: +userId }, isAccepted: true },
        { user2: { id: +userId }, isAccepted: true },
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


  private getUserIdsOrder(id1: number, id2: number): [number, number] {
    return id1 < id2 ? [id1, id2] : [id2, id1];
  }

 async areFriends(userId1: number, userId2: number): Promise<boolean> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { user1: { id: userId1 }, user2: { id: userId2 }, isAccepted: true },
        { user1: { id: userId2 }, user2: { id: userId1 }, isAccepted: true },
      ],
    });
    return !!friendship;
  }
}