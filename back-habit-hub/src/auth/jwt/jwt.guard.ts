import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token found');
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token is invalid or expired');
        }
    }
}
