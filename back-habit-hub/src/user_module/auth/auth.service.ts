import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EmailService } from '../../internal_module/email/email.service'
import { v4 as uuidv4 } from 'uuid'
import { generateToken, scryptHash, scryptVerify } from '../auth/auth.utils'
import { LoginDto } from './dto/login.dto'
import { UsersService } from '../users/users.service'
import { RegistrationDto } from './dto/registration.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../users/entities/users.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly userService: UsersService,
        @InjectRepository(User) 
        private readonly userRepository: Repository<User> 
    ) {}

    private one_hour_exparation = 60 * 60 * 1000

    async login(userData: LoginDto): Promise<{ token: string }> {
        const user = await this.userService.getUserByQuery({
            username: userData.username,
        })
        if (!user) {
            throw new NotFoundException(
                'Invalid credentials. Please try again.'
            )
        }
        const isValid = await scryptVerify(userData.password, user.password)
        if (!isValid) {
            throw new BadRequestException('Invalid password.')
        }
        const token = await generateToken(user.id.toString(), this.jwtService)
        return { token: token }
    }


    async registerUser(
        userData: RegistrationDto,
        file?: Express.Multer.File
    ): Promise<{ emailSent: boolean }> {

        const existing_user = await this.userService.getUserByQuery({
            email: userData.email,
            username: userData.username,
        })
        if (existing_user && existing_user.isVerified) {
            throw new BadRequestException(
                'User already have an account. Try to log in.'
            )
        }
        const code = uuidv4()
        const expiresAt = new Date(Date.now() + this.one_hour_exparation)
        if (existing_user && !existing_user.isVerified) {
            await this.userService.handleUnverifiedUser(existing_user)
            return { emailSent: true }
        }

        const user_with_username = await this.userService.getUserByQuery({
            username: userData.username,
        })
        if (user_with_username) {
            throw new BadRequestException('Username is already taken')
        }
        const user_with_email = await this.userService.getUserByQuery({
            email: userData.email,
        })
        if (user_with_email) {
            throw new BadRequestException('Email is already taken')
        }
        const hashedPassword = await scryptHash(userData.password)

        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            profile_picture: file?.filename || null,
            isVerified: false,
            verification_code: code,
            verification_expires_at: expiresAt,
        })
        await this.userRepository.save(user)
        await this.emailService.sendVerificationEmail(userData.email, code)

        return { emailSent: true }
    }
}
