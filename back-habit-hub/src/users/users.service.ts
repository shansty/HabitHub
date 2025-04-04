import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateLoginUserDto, CreateUserDto, ResetUserPasswordDto, UserDto, VerifyUserResetCodeDto } from './users.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { scryptHash, scryptVerify } from '../auth.utils';

@Injectable()

export class UsersService {
    constructor(
        @InjectRepository(User)
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) { }


    async login(userData: CreateLoginUserDto): Promise<{ token: string }> {
        const user = await this.getUserByQuery({
            username: userData.username,
        });
        if (!user) {
            throw new NotFoundException('Invalid credentials. Please try again.');
        }
        const isValid = await scryptVerify(userData.password, user.password)
        if(!isValid) {
            throw new BadRequestException('Invalid password.');
        }
        return { token: await this.jwtService.signAsync({ userId: user.id }), };
    }


    async registerUserAndSendVerificationLink(userData: CreateUserDto, file?: Express.Multer.File): Promise<{ emailSent: boolean }> {
        const existing_user = await this.getUserByQuery({
            email: userData.email,
            username: userData.username
        })
        if (existing_user && existing_user.isVerified) {
            throw new BadRequestException("User already have an account. Try to log in.")
        }
        const code = uuidv4();
        // 
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

        if (existing_user && !existing_user.isVerified) {
            const now = new Date();
            if (existing_user.verification_expires_at && existing_user.verification_expires_at > now) {
                throw new BadRequestException('Verification email already sent. You can get a new link in 1 hour.');
            }
            existing_user.verification_code = code;
            existing_user.verification_expires_at = expiresAt;
            await this.userRepository.save(existing_user);
            await this.emailService.sendVerificationEmail(existing_user.email, code);
            return { emailSent: true };
        }
        const hashedPassword = await scryptHash(userData.password);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            profile_picture: file?.filename || null,
            isVerified: false,
            verification_code: code,
            verification_expires_at: expiresAt,
        });
        await this.userRepository.save(user);
        await this.emailService.sendVerificationEmail(userData.email, code);
        return { emailSent: true };
    }


    async verifyEmail(code: string): Promise<{ success: boolean }> {
        const user = await this.getUserByQuery({ verification_code: code });
        if (!user) {
            throw new NotFoundException('Verification link is invalid or has already been used.');
        }
        const now = new Date();
        if (user.verification_expires_at < now) {
            throw new BadRequestException("Verification link is expired.")
        }
        user.isVerified = true;
        user.verification_code = null;
        await this.userRepository.save(user);
        return { success: true };
    }


    async resetPassword(userData: ResetUserPasswordDto): Promise<{ success: boolean }> {
        const user = await this.getUserByQuery({ email: userData.email })
        if (!user) {
            throw new BadRequestException("User with such email doesn't exist")
        }
        const code = this.generate6DigitCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        user.reset_code = code;
        user.reset_code_expires_at = expiresAt;
        user.temp_password = userData.new_password;
        await this.userRepository.save(user);
        await this.emailService.sendPasswordResetCode(user.email, code);
        return { success: true };
    }


    async verifyResetCode(data: VerifyUserResetCodeDto): Promise<{ success: boolean } | void> {
        const user = await this.getUserByQuery({ reset_code: data.code })
        if (!user) {
            throw new BadRequestException("You entered the wrong code. Please try again.")
        }
        const now = new Date();
        if (user.reset_code_expires_at && user.reset_code_expires_at < now) {
            throw new BadRequestException("Verification code is expired. Please create a new one.")
        }
        const user_code = user.reset_code;
        if (!user_code) {
            throw new NotFoundException("Verification code not found. Please create a new one.")
        }
        if (data.code != user_code) {
            throw new BadRequestException("Wrong verefication code. Please try again.")
        }
        if (data.code == user_code && user.temp_password) {
            user.password = user.temp_password;
            user.temp_password = undefined;
            user.reset_code = undefined;
            user.reset_code_expires_at = undefined;
            await this.userRepository.save(user);
            return ({ success: true })
        }
        throw new BadRequestException('Invalid password reset state. Please try again.');
    }


    async getUserData(id: string): Promise<{ user: UserDto }> {
        if (!id) {
            throw new ForbiddenException("You need to log in to see this data.")
        }
        const user = await this.getUserByQuery({ id: id });
        if (!user) {
            throw new NotFoundException("User data not found.")
        }
        const userData = {
            username: user.username,
            email: user.email,
            profile_picture: user.profile_picture,
        }
        return ({ user: userData })
    }


    private async getUserByQuery(query: Object): Promise<User | null> {
        const user = await this.userRepository.findOneBy(query);
        return user;
    }


    private generate6DigitCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
