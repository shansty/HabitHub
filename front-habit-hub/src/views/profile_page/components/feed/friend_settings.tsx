import React from 'react'
import { useDeleteFriendMutation } from '../../../../services/friendship'
import { useNavigate } from 'react-router-dom';

interface FriendSettingsProps {
    friendId: number;
    setCustomError: React.Dispatch<React.SetStateAction<string | null>>
}

const FriendSettings: React.FC<FriendSettingsProps> = ({
    friendId,
    setCustomError

}) => {
    const [deleteFriend] = useDeleteFriendMutation();
    const errorMessageTimeout = 2000;
    const navigate = useNavigate();

    const handleDeleteFriend = async (friendId: number) => {
        try {
            await deleteFriend(friendId).unwrap()
        } catch (err: any) {
            setCustomError(err?.data?.message)
            setTimeout(() => {
                setCustomError(null)
            }, errorMessageTimeout)
        }
    }

    const handleProfileFriend = (friendId: number) => {
        navigate(`/friend/${friendId}`)
    }

    return (
        <ul className="py-1 md:py-3 text-sm text-gray-700 ">
            <li
                className="px-4 py-1 md:py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProfileFriend(friendId)}
            >
                Profile
            </li>
            <li
                className="px-4 py-1 md:py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDeleteFriend(friendId)}
            >
                Delete
            </li>
        </ul>
    )
}

export default FriendSettings
