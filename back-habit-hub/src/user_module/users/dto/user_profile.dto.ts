import { IsOptional, IsNotEmpty, IsString } from 'class-validator'

export class UserProfileDto {
    @IsString()
    @IsOptional()
    username: string

    @IsString()
    @IsOptional()
    profile_picture: File | string | null
}
