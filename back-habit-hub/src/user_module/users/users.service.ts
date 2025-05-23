import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/users.entity'
import { ILike, Not, Repository } from 'typeorm'
import { ResetUserPasswordDto } from './dto/reset_user_password.dto'
import { VerifyUserResetCodeDto } from './dto/verify_user_reset_code.dto'
import { UserDto } from './dto/user.dto'
import { UserProfileDto } from './dto/user_profile.dto'
import { EmailService } from '../../internal_module/email/email.service'
import { v4 as uuidv4 } from 'uuid'
import { SearchUsersDto } from './dto/search-users.dto'
import { scryptHash } from '../auth/auth.utils'
import { S3Service } from '../../internal_module/s3/s3.service'


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly emailService: EmailService,
        private readonly s3Service: S3Service
    ) { }

    private one_hour_exparation = 60 * 60 * 1000
    private fifteen_minutes_exparation = 15 * 60 * 1000

    async sendVerificationEmail(user: User, code: string): Promise<boolean> {
        if (!user || user.isVerified) {
            return false;
        }
        await this.emailService.sendVerificationEmail(
            user.email,
            code
        );
        return true;
    }


    async handleUnverifiedUser(existingUser: User): Promise<{ emailSent: boolean }> {
        const now = new Date();
        if (existingUser.verification_expires_at && existingUser.verification_expires_at > now) {
            throw new BadRequestException(
                'Verification email already sent. You can get a new link in 1 hour.'
            );
        }

        const code = uuidv4();
        const expiresAt = new Date(Date.now() + this.one_hour_exparation);

        existingUser.verification_code = code;
        existingUser.verification_expires_at = expiresAt;
        await this.userRepository.save(existingUser);

        const emailSent = await this.sendVerificationEmail(existingUser, code);
        return { emailSent };
    }


    async verifyEmail(code: string): Promise<{ success: boolean }> {
        const user = await this.getUserByQuery({ verification_code: code })
        if (!user) {
            throw new NotFoundException(
                'Verification link is invalid or has already been used.'
            )
        }
        const now = new Date()
        if (user.verification_expires_at < now) {
            throw new BadRequestException('Verification link is expired.')
        }
        user.isVerified = true
        user.verification_code = null
        await this.userRepository.save(user)
        return { success: true }
    }

    async resetPassword(
        userData: ResetUserPasswordDto
    ): Promise<{ success: boolean }> {
        const user = await this.getUserByQuery({ email: userData.email })
        if (!user) {
            throw new BadRequestException("User with such email doesn't exist")
        }
        const code = this.generate6DigitCode()
        const expiresAt = new Date(Date.now() + this.fifteen_minutes_exparation)
        user.reset_code = code
        user.reset_code_expires_at = expiresAt
        user.temp_password = await scryptHash(userData.new_password)
        await this.userRepository.save(user)
        await this.emailService.sendPasswordResetCode(user.email, code)
        return { success: true }
    }

    async verifyResetCode(
        data: VerifyUserResetCodeDto
    ): Promise<{ success: boolean } | void> {
        const user = await this.getUserByQuery({ reset_code: data.code })
        if (!user) {
            throw new BadRequestException(
                'You entered the wrong code. Please try again.'
            )
        }
        const now = new Date()
        if (user.reset_code_expires_at && user.reset_code_expires_at < now) {
            throw new BadRequestException(
                'Verification code is expired. Please create a new one.'
            )
        }
        const user_code = user.reset_code
        if (!user_code) {
            throw new NotFoundException(
                'Verification code not found. Please create a new one.'
            )
        }
        if (data.code != user_code) {
            throw new BadRequestException(
                'Wrong verefication code. Please try again.'
            )
        }
        if (data.code == user_code && user.temp_password) {
            user.password = user.temp_password
            user.temp_password = undefined
            user.reset_code = undefined
            user.reset_code_expires_at = undefined
            await this.userRepository.save(user)
            return { success: true }
        }
        throw new BadRequestException(
            'Invalid password reset state. Please try again.'
        )
    }

    async getUserData(id: string): Promise<{ user: UserDto }> {
        if (!id) {
            throw new ForbiddenException('You need to log in to see this data.')
        }
        const user = await this.getUserByQuery({ id: id })
        if (!user) {
            throw new NotFoundException('User data not found.')
        }
        const userData = {
            username: user.username,
            email: user.email,
            profile_picture: user.profile_picture,
        }
        return { user: userData }
    }

    async updateUserProfile(
        body: UserProfileDto,
        userId: string,
        file?: Express.Multer.File
    ): Promise<{ success: boolean }> {
        const user = await this.getUserByQuery({ id: userId })
        if (!user) {
            throw new ForbiddenException('You need to log in to see this data.')
        }
        if (body.username && body.username !== user.username) {
            const existingUser = await this.getUserByQuery({
                username: body.username,
            })

            if (existingUser && existingUser.id !== user.id) {
                throw new BadRequestException('Username is already taken.')
            }
        }
        console.dir({'Received file': file});
        const uploadedImageUrl = file ? await this.s3Service.uploadFile(file) : user.profile_picture;

        const updatedUser = {
          ...user,
          username: body.username || user.username,
          profile_picture: uploadedImageUrl,
        };

        await this.userRepository.save(updatedUser)
        return { success: true }
    }


    async searchUsers(username: string, userId: string): Promise<SearchUsersDto[]> {
        if (!username) return []
        const exactMatch = await this.userRepository.findOne({
            where: {
                username: username,
                id: Not(Number(userId)), 
            },
            relations: ['friendshipsInitiated', 'friendshipsReceived'],
        })
        if (exactMatch) {
            const friendship = [...exactMatch.friendshipsInitiated, ...exactMatch.friendshipsReceived]
              .find(f =>
                (f.user1.id == +userId || f.user2.id == +userId)
              );
            return [
                {
                    id: exactMatch.id,
                    username: exactMatch.username,
                    status: friendship?.status ?? null
                },
            ]
        }
        const users = await this.userRepository.find({
            where: {
                username: ILike(`%${username}%`),
                id: Not(Number(userId)), 
            },
            take: 10,
            relations: ['friendshipsInitiated', 'friendshipsReceived'],
        })
        const searchUsers = users.map((user) => {
            const friendship = [...user.friendshipsInitiated, ...user.friendshipsReceived]
              .find(f =>
                (f.user1.id == +userId || f.user2.id == +userId)
              );
            return {
                id: user.id,
                username: user.username,
                status: friendship?.status ?? null,
            }
        })
        return searchUsers
    }


    async getFriendUserData(friendId: string, userId: string) {
        const friend = await this.getUserByQuery({ id: friendId })
        if (!friend) {
            throw new NotFoundException('User data not found.')
        }
        const friendUserData = {
            username: friend.username,
            email: friend.email,
            profile_picture: friend.profile_picture,
        }
        return { friend: friendUserData }
    }


    async getUserByQuery(query: Object): Promise<User | null> {
        const user = await this.userRepository.findOneBy(query)
        return user
    }


    private generate6DigitCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }
}

