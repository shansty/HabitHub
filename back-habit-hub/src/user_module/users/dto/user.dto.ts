import { IsEmail, IsOptional,IsNotEmpty, IsString } from "class-validator";


  export class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    profile_picture: string | null;
}
