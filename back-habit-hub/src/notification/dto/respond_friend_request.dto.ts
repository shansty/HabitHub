import { FriendshipStatus } from "../../friendship/friendship_enum";

export class RespondFriendRequestDto {
    status: FriendshipStatus.ACCEPTED | FriendshipStatus.REJECTED;
    senderId: number;
  }