import { IsEmail, IsOptional,IsNotEmpty, IsString, IsUUID, IsBoolean, IsDate } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required. ' })
    username: string

    @IsEmail({}, { message: 'Please provide a valid email address. ' })
    @IsNotEmpty({ message: 'Email is required. ' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required. ' })
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

    @IsDate()
    @IsOptional()
    verification_expires_at?: Date

    @IsString()
    @IsOptional()
    temp_password?: string;

    @IsString()
    @IsOptional()
    reset_code?: string;

    @IsDate()
    @IsOptional()
    reset_code_expires_at?: Date
    
}