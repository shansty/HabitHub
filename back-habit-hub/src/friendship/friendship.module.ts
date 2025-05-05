import { forwardRef, Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { UsersModule } from '../user_module/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Friendship]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '120h' },
      }),
    }),
    NotificationModule
  ],
  controllers: [FriendshipController],
  providers: [FriendshipService],
  exports: [FriendshipService]
})
export class FriendshipModule { }
