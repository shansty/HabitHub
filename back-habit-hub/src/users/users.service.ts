import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, 
    ) {}

    async createUser(userData: CreateUserDto): Promise<User> {
        try {
            const user = this.userRepository.create(userData);
            throw new InternalServerErrorException('Failed to create user');
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
}
