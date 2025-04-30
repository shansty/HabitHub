import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/users.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { EmailModule } from '../../internal_module/email/email.module'
import { AuthModule } from '../auth/auth.module'
import { Friendship } from '../../friendship/entities/friendship.entity'
import { FriendshipModule } from '../../friendship/friendship.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Friendship]),
        EmailModule,
        forwardRef(() => AuthModule),
        FriendshipModule,
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule { }
