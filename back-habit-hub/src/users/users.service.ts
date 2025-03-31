import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateLoginUserDto } from './users.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async login(userData: CreateLoginUserDto): Promise<{ token: string }> {
        try {
            const user = await this.userRepository.findOneBy({
                username: userData.username,
                password: userData.password,
            });
            if (!user) {
                throw new InternalServerErrorException('Invalid credentials');
            }
            console.log('user:', user);
            console.log('user.id:', user?.id);
            return {
                token: await this.jwtService.signAsync({ userId: user.id }),
              };
        } catch (error) {
            console.error('Login error:', error);
            throw new InternalServerErrorException('Failed to login');
        }
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
}
