import {
    IsEmail,
    IsOptional,
    IsNotEmpty,
    IsString,
    IsUUID,
    IsBoolean,
    IsDate,
    MinLength,
    Matches,
} from 'class-validator'

export class RegistrationDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required. ' })
    username: string

    @IsEmail({}, { message: 'Please provide a valid email address. ' })
    @IsNotEmpty({ message: 'Email is required. ' })
    email: string

    @IsString()
    @IsNotEmpty({ message: 'Password is required. ' })
    @MinLength(12, {
        message: 'Password must be at least 12 characters long'
    })
    @Matches(/(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
        message: 'Password must contain: 1 number, 1 uppercase letter, and 1 special character (!@#$%^&*)'
    })
    password: string

    @IsString()
    @IsOptional()
    profile_picture: string | null

    @IsUUID()
    @IsOptional()
    verification_code?: string

    @IsBoolean()
    @IsOptional()
    isVerified?: boolean

    @IsDate()
    @IsOptional()
    verification_expires_at?: Date

    @IsString()
    @IsOptional()
    temp_password?: string

    @IsString()
    @IsOptional()
    reset_code?: string

    @IsDate()
    @IsOptional()
    reset_code_expires_at?: Date
}
