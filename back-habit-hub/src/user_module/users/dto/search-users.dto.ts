import { IsString, IsOptional, MinLength, IsNumber } from 'class-validator';

export class SearchUsersDto {
  @IsNumber()
  id: number;  

  @IsOptional()
  @IsString()
  username?: string;
}