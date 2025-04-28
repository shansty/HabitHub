import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Friendship } from './entities/friendship.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendshipDto } from './dto/create-friendship.dto';


@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>
  ) { }

  async sendFriendRequest(createFriendshipDto: CreateFriendshipDto, userId: string):Promise<{success: boolean}> {
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
      throw new BadRequestException('You are already friends.');
    }

    const friendship = this.friendshipRepository.create({
      user1: { id: user1Id },
      user2: { id: user2Id },
      isAccepted: false,
    });

    await this.friendshipRepository.save(friendship);
    return {success: true};
  }


  async acceptFriendRequest(createFriendshipDto: CreateFriendshipDto) {
    const { senderId, receiverId } = createFriendshipDto;

    const [user1Id, user2Id] = senderId < receiverId
      ? [senderId, receiverId]
      : [receiverId, senderId];

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


  async findAll(): Promise<Friendship[]> {
    return this.friendshipRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

}  