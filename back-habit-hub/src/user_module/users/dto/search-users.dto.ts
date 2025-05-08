import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { FriendshipStatus } from '../../../friendship/friendship_enum';

export class SearchUsersDto {
  @IsNumber()
  id: number;  

  @IsOptional()
  @IsString()
  username?: string;

  @IsBoolean()
  status: FriendshipStatus | null
}