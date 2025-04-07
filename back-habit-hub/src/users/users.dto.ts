import { IsEmail, IsOptional,IsNotEmpty, IsString, IsUUID, IsBoolean, isDate, IsDate } from "class-validator";

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

export class CreateLoginUserDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class ResetUserPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    new_password: string;

    @IsString()
    @IsNotEmpty()
    confirm_password: string;
}

export class VerifyUserResetCodeDto {
    code: string;
  }


  export class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    profile_picture: string | null;
}

export class UserProfileDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsOptional()
    profile_picture: File | string | null;
}