import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateLoginUserDto } from './users.dto';

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('login')
    login(@Body() CreateLoginUserDto: CreateLoginUserDto) {
        return this.userService.login(CreateLoginUserDto);
    }
    
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }
}
