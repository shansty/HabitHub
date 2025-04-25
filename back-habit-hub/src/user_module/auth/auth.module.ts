import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET'),
                signOptions: { expiresIn: '120h' },
            }),
        }),
    ],
    providers: [JwtStrategy],
    exports: [JwtModule],
})
export class AuthModule {}
