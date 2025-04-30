import { IsString, IsOptional, MinLength, IsNumber, IsBoolean } from 'class-validator';

export class SearchUsersDto {
  @IsNumber()
  id: number;  

  @IsOptional()
  @IsString()
  username?: string;

  @IsBoolean()
  isFriends: boolean
}