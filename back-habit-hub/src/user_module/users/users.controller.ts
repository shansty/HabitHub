import {
    Body,
    Controller,
    Get,
    UploadedFile,
    UseInterceptors,
    Param,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ResetUserPasswordDto } from './dto/reset_user_password.dto'
import { VerifyUserResetCodeDto } from './dto/verify_user_reset_code.dto'
import { UserDto } from './dto/user.dto'
import { UserProfileDto } from './dto/user_profile.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/jwt_guard/jwt.guard'
import { User } from '../auth/jwt_guard/user.decorator'
import { FriendshipGuard } from '../../friendship/friendship_guard/friendship.guard'

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UsersService) { }


    @UseGuards(JwtAuthGuard)
    @Get('search')
    async searchUsers(
        @Query('username') username: string,
        @User('userId') userId: string
    ) {
        return this.userService.searchUsers(username, userId);
    }

    @Patch('email_verification')
    verifyEmail(@Query('code') code: string) {
        return this.userService.verifyEmail(code)
    }

    @Patch('password/reset')
    resetPassword(@Body() resetUserPasswordDto: ResetUserPasswordDto) {
        return this.userService.resetPassword(resetUserPasswordDto)
    }

    @Patch('password/code_verification')
    verifyResetCode(@Body() data: VerifyUserResetCodeDto) {
        return this.userService.verifyResetCode(data)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserData(@Param('id') id: string, @User('userId') userId: string) {
        return this.userService.getUserData(userId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    @UseInterceptors(FileInterceptor('profile_picture'))
    updateUserProfile(
        @Body() data: UserProfileDto,
        @User('userId') userId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.userService.updateUserProfile(data, userId, file)
    }


    @UseGuards(JwtAuthGuard, FriendshipGuard)
    @Get('friend/:friendId')
    getFrienUserData(
        @Param('friendId') friendId: string,
        @User('userId') userId: string) {
        return this.userService.getFriendUserData(friendId, userId)
    }
}
