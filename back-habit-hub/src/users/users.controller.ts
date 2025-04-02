import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateLoginUserDto } from './users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('login')
  login(@Body() CreateLoginUserDto: CreateLoginUserDto) {
    return this.userService.login(CreateLoginUserDto);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('profile_picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  registerUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.registerUser(createUserDto, file);
  }


  @Put('verify-email/:code')
  verifyEmail(
    @Param('code') code: string
  ) {
    return this.userService.verifyEmail(code);
  }


  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }


}
