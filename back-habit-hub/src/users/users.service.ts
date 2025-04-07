import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { LoginUserDto } from './dto/login_user.dto';
import { ResetUserPasswordDto } from './dto/reset_user_password.dto';
import { VerifyUserResetCodeDto } from './dto/verify_user_reset_code.dto';
import { UserDto } from './dto/user.dto';
import { UserProfileDto } from './dto/user_profile.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, scryptHash, scryptVerify } from '../auth/auth.utils';

@Injectable()

export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) { }

    private one_hour_exparation = 60 * 60 * 1000;
    private fifteen_minutes_exparation = 15 * 60 * 1000;

    async login(userData: LoginUserDto): Promise<{ token: string }> {
        const user = await this.getUserByQuery({
            username: userData.username,
        });
        if (!user) {
            throw new NotFoundException('Invalid credentials. Please try again.');
        }
        const isValid = await scryptVerify(userData.password, user.password)
        if (!isValid) {
            throw new BadRequestException('Invalid password.');
        }
        const token = await generateToken(user.id.toString(), this.jwtService);
        return { token: token };
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
        const expiresAt = new Date(Date.now() + this.one_hour_exparation);
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

        const user_with_username = await this.getUserByQuery({ username: userData.username })
        if (user_with_username) {
            throw new BadRequestException("Username is already taken")
        }
        const user_with_email = await this.getUserByQuery({ email: userData.email })
        if (user_with_email) {
            throw new BadRequestException("Email is already taken")
        }
        const hashedPassword = await scryptHash(userData.password);

        const user = await this.userRepository.create({
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
        const expiresAt = new Date(Date.now() + this.fifteen_minutes_exparation);
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


    async updateUserProfile(body: UserProfileDto, userId: string, file?: Express.Multer.File): Promise<{ success: boolean }> {
        const user = await this.getUserByQuery({ id: userId })
        if (!user) {
            throw new ForbiddenException("You need to log in to see this data.")
        }
        console.dir({body, file})
        const updated_user_username = body.username ? body.username : user.username;
        const updated_user_profile_picrute = file ? file.filename : user.profile_picture;
        const updatedUser = {
            ...user,
            username: updated_user_username,
            profile_picture: updated_user_profile_picrute,
        }

        await this.userRepository.save(updatedUser);
        return ({ success: true })
    }


    private async getUserByQuery(query: Object): Promise<User | null> {
        const user = await this.userRepository.findOneBy(query);
        return user;
    }


    private generate6DigitCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
