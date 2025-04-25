import { IsString } from 'class-validator'

export class VerifyUserResetCodeDto {
    @IsString()
    code: string
}
