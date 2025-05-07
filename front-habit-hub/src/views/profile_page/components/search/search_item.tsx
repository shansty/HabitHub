import React from 'react';
import { FriendshipPreview } from '../../../../types';
import { FriendshipStatus } from '../../../../enums';

interface SearchUserItemProps {
  friendship: FriendshipPreview;
  handleAddFriend: (receiverId: number) => Promise<void>;
  sendingFriendId: number | null;
  isSendingFriendRequest: boolean;
}

const SearchUserItem: React.FC<SearchUserItemProps> = ({
  friendship,
  handleAddFriend,
  isSendingFriendRequest,
  sendingFriendId,
}) => {
  const { id, username, status } = friendship;

  const isLoading = sendingFriendId === id && isSendingFriendRequest;

  const renderActionButton = () => {
    switch (status) {
      case FriendshipStatus.ACCEPTED:
        return (
          <button className="bg-white border border-green-600 text-green-800 text-xs px-2 py-1 rounded-md cursor-default">
            Your friend
          </button>
        );

      case FriendshipStatus.PENDING:
        return (
          <button
            disabled
            className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-md cursor-not-allowed"
          >
            Request sent
          </button>
        );

      case null:
      default:
        return (
          <button
            onClick={() => handleAddFriend(id)}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2 py-1 rounded-md"
          >
            {isLoading ? 'Sending...' : 'Add to friend'}
          </button>
        );
    }
  };

  return (
    <div
      key={id}
      className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-sm"
    >
      <span>{username}</span>
      {renderActionButton()}
    </div>
  );
};

export default SearchUserItem;
