import { IsEmail, IsOptional,IsNotEmpty, IsString, IsUUID, IsBoolean } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    profile_picture: string | null;
    
    @IsUUID()
    @IsOptional()
    verification_code?: string;
  
    @IsBoolean()
    @IsOptional()
    isVerified?: boolean;
}

export class CreateLoginUserDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string;
}