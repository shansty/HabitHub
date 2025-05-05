import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './notification_enums';
import { User } from '../user_module/users/entities/users.entity';
import { Habit } from '../habit_module/habit/entities/habit.entity';
import { NotificationPreviewDto } from './dto/notification.dto';
import { RespondFriendRequestDto } from './dto/respond_friend_request.dto';
import { FriendshipService } from '../friendship/friendship.service';
import { FriendshipStatus } from '../friendship/friendship_enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => FriendshipService))
    private readonly friendshiService: FriendshipService
  ) { }

  async createNotifications(
    senderId: number,
    recipientIds: number[],
    type: NotificationType,
    message: string,
  ): Promise<Notification[]> {
    const sender = await this.userRepo.findOneBy({ id: senderId });
    if (!sender) {
      throw new BadRequestException("In this notification no valid sender")
    }
    const recipients = await this.userRepo.findByIds(recipientIds);
    const validRecipients = recipients.filter(recipient => recipient.id !== sender.id);
    if (validRecipients.length === 0) {
      return [];
    }
    const notifications = recipients.map((recipient) =>
      this.notificationRepo.create({
        sender,
        recipient,
        type,
        message,
      }),
    );
    return this.notificationRepo.save(notifications);
  }


  async notifyDailyGoalCompleted(habit: Habit, senderId: number, friendIds: number[]) {
    const message = `🎯 ${habit.user.username} completed today's goal for ${habit.name}!`;
    return this.createNotifications(
      senderId,
      friendIds,
      NotificationType.DAILY_GOAL_COMPLETED,
      message,
    );
  }


  async notifyHabitCompleted(habit: Habit, senderId: number, friendIds: number[]) {
    const message = `🏆 ${habit.user.username} completed the habit: ${habit.name}`;
    const notifications = this.createNotifications(
      senderId,
      friendIds,
      NotificationType.HABIT_COMPLETED,
      message,
    );
    return notifications
  }


  async notifyFriendRequest(senderId: number, recipientId: number) {
    const sender = await this.userRepo.findOneBy({ id: senderId });
    if (!sender) throw new Error('Sender not found');
    const message = `🤝 ${sender.username} wants to be your friend`;
    return this.createNotifications(
      senderId,
      [recipientId],
      NotificationType.RECEIVE_FRIENDSHIP_REQUEST,
      message,
    );
  }


  async getUsersNotifications(
    userId: number,
    page: number = 1,
    limit: number = 3
  ): Promise<{ notifications: NotificationPreviewDto[]; nextPage: number | null }> {
    const skip = (page - 1) * limit;
    const [notifications, total] = await this.notificationRepo.findAndCount({
      where: {
        recipient: { id: userId }
      },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });
    const formatted = notifications.map((notification) => ({
      id: notification.id,
      senderId: notification.sender.id,
      message: notification.message,
      type: notification.type,
      createdAt: notification.createdAt,
    }));
    const hasMore = skip + formatted.length < total;
    const nextPage = hasMore ? page + 1 : null;
    return { notifications: formatted, nextPage };
  }


  async respondToFriendRequest(notificationId: number, { senderId, status }: RespondFriendRequestDto): Promise<{ success: boolean }> {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
      relations: ['recipient', 'sender'],
    });
    if (!notification) throw new NotFoundException('Notification not found');
    const recipientId = notification.recipient.id;
    const friendship = await this.friendshiService.getFriendshipWithAnyStatus(senderId, recipientId)
    if (!friendship) throw new NotFoundException('Friendship record not found');
    friendship.status = status as FriendshipStatus;
    await this.friendshiService.saveFriendship(friendship);
    await this.notificationRepo.delete(notificationId);
    return { success: true };
  }

}