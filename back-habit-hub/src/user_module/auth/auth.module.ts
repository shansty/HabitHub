import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt_guard/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { EmailModule } from '../../internal_module/email/email.module'
import { UsersModule } from '../users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/users.entity'
import { S3Service } from '../../internal_module/s3/s3.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfigModule,
        EmailModule,
        forwardRef(() => UsersModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET'),
                signOptions: { expiresIn: '120h' },
            }),
        }),
    ],
    providers: [JwtStrategy, AuthService, S3Service],
    exports: [JwtModule],
    controllers: [AuthController],
})
export class AuthModule { }
