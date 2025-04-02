import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateLoginUserDto, CreateUserDto } from './users.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';


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
        try {
            const user = await this.userRepository.findOneBy({
                username: userData.username,
                password: userData.password,
            });
            if (!user) {
                throw new NotFoundException('Invalid credentials.');
            }
            return {
                token: await this.jwtService.signAsync({ userId: user.id }),
            };
        } catch (error) {
            console.error('Login error:', error);
            throw new InternalServerErrorException('Failed to login');
        }
    }

    async registerUser(userData: CreateUserDto, file?: Express.Multer.File): Promise<{ emailSent: boolean }> {
        try {
            const code = uuidv4();
            const existing_user = await this.userRepository.findOneBy({
                email: userData.email,
                username: userData.username
            })
            if(existing_user && existing_user.isVerified == false) {
                throw new BadRequestException(`Waiting for email verfication `)
            }
            if(existing_user) {
                throw new BadRequestException("Username or email is already taken.")
            }
            const user = this.userRepository.create({
                ...userData,
                profile_picture: file?.filename || null,
                isVerified: false,
                verification_code: code
            });
            await this.userRepository.save(user);
            await this.emailService.sendVerificationEmail(userData.email, code);
            return { emailSent: true };
        } catch (err) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async verifyEmail(code: string) {
        try {
            const user = await this.userRepository.findOneBy({ verification_code: code });
            if (!user) {
                throw new NotFoundException('Verification code is invalid or expired.');
            }
            user.isVerified = true;
            user.verification_code = null;
            await this.userRepository.save(user);
            return { success: true, message: 'Email verified successfully!' };
        } catch (err) {
            throw new InternalServerErrorException('Failed to verificate email');
        }
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
}
