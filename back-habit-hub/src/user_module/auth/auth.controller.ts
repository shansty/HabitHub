import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
    Param,
    Put,
    Patch,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { RegistrationDto } from './dto/registration.dto'


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('profile_picture', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9)
                    const ext = extname(file.originalname)
                    cb(null, `${uniqueSuffix}${ext}`)
                },
            }),
        })
    )
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