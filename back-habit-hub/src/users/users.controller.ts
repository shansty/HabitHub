import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Param, Put, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateLoginUserDto, ResetUserPasswordDto, VerifyUserResetCodeDto } from './users.dto';
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
  registerUserAndSendVerificationLink(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.registerUserAndSendVerificationLink(createUserDto, file);
  }


  @Patch('email_verification')
  verifyEmail(
    @Query('code') code: string,
  ) {
    return this.userService.verifyEmail(code);
  }

  @Patch('password/reset')
  resetPassword(@Body() resetUserPasswordDto: ResetUserPasswordDto) {
    return this.userService.resetPassword(resetUserPasswordDto);
  }

  @Patch('password/code_verification')
  verifyResetCode(@Body() data: VerifyUserResetCodeDto) {
    return this.userService.verifyResetCode(data);
  }

  @Get(":id")
  getUserData(
    @Param("id") id: string
  ) {
    return this.userService.getUserData(id);
  }

}
