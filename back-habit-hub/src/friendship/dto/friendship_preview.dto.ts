import { FriendshipStatus } from "../friendship_enum";

export class FriendshipPreviewDto {
    id: number;
    username: string;
    status: FriendshipStatus
  }