import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ResetUserPasswordDto {
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    new_password: string

    @IsString()
    @IsNotEmpty()
    confirm_password: string
}
