import React from 'react';
import { UserPreview } from '../../../../types';

interface SearchUserItemProps {
    user: UserPreview;
    handleAddFriend: (receiverId: number) => Promise<void>;
    sendingFriendId: number | null;
    isSendingFriendRequest: boolean

}

const SearchUserItem: React.FC<SearchUserItemProps> = ({ user, handleAddFriend, isSendingFriendRequest, sendingFriendId }) => {
    return (
        <div
            key={user.id}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
            <span>{user.username}</span>
            {user.isFriends ?
                <button
                    className="bg-white border-1 border-indigo-700 text-gray-900 text-xs px-2 py-1 rounded-md"
                >Your friend</button>
                :
                <button
                    onClick={() => handleAddFriend(user.id)}
                    disabled={sendingFriendId === user.id || isSendingFriendRequest}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2 py-1 rounded-md"
                >
                    Add to friend
                </button>
            }
        </div>
    );
}

export default SearchUserItem;
