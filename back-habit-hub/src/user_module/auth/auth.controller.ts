import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { RegistrationDto } from './dto/registration.dto'


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Post()
    @UseInterceptors(FileInterceptor('profile_picture'))
    registerUser(
        @Body() userData: RegistrationDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.authService.registerUser(
            userData,
            file
        )
    }
}