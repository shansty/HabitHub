import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/users.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { EmailModule } from '../../internal_module/email/email.module'
import { AuthModule } from '../auth/auth.module'
import { Friendship } from '../../friendship/entities/friendship.entity'
import { FriendshipModule } from '../../friendship/friendship.module'
import { S3Service } from '../../internal_module/s3/s3.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Friendship]),
        EmailModule,
        forwardRef(() => AuthModule),
        FriendshipModule,
    ],
    providers: [UsersService, S3Service],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule { }
