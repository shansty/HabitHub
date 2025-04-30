import React from 'react'
import {
    useGetFriendUserDataQuery,
} from '../../../services/user'
import profile from '../../../assets/profile.png'
import { useParams } from 'react-router-dom'

const FriendUserData: React.FC = () => {
    const { friendId } = useParams();
    const { data } = useGetFriendUserDataQuery(Number(friendId))

    const profilePic = data?.friend.profile_picture
        ? `${import.meta.env.VITE_LOCAL_HOST}/uploads/${data.friend.profile_picture}`
        : profile


    return (
        <div className="flex items-start space-x-6 w-full">
            <div
                className="relative w-16 h-16"
            >
                <img
                    src={profilePic}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover shadow"
                />
            </div>

            <div className="flex-1">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold text-indigo-700">
                            {data?.friend.username}
                        </h2>
                    </div>
                <p className="text-gray-600">{data?.friend.email}</p>
            </div>
        </div>
    )
}

export default FriendUserData
