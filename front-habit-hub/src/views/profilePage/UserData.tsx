import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserDataQuery, useUpdateUserProfileMutation } from '../../services/user';
import { getToken, getIDFromToken } from '../../utils';
import profile from '../../assets/profile.png'
import { Camera, Check, Pencil, X } from 'lucide-react';


const UserData: React.FC = () => {
    const token = getToken();
    const userId = getIDFromToken(token);
    const [isHovered, setIsHovered] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [username, setUsername] = useState("")
    const { data } = useGetUserDataQuery(userId);
    const [updateUserProfile, { error: updateError }] = useUpdateUserProfileMutation();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const profilePic = data?.user.profile_picture
        ? `${import.meta.env.VITE_LOCAL_HOST}/uploads/${data.user.profile_picture}`
        : profile;

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleProfilePicClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleProfilePhotoOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        if (e.target.files && e.target.files.length > 0) {
            formData.append('profile_picture', e.target.files[0]);
            await updateUserProfile(formData);
            navigate(0)
        }
    };


    const handleUsernameOnChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        await updateUserProfile(formData);
        setIsEdited(false);
        navigate(0);
    };



    return (
        <div className="flex items-start space-x-6 w-full">
            <div
                className="relative w-24 h-24"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={profilePic}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover shadow"
                />
                {isHovered && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 rounded-full cursor-pointer"
                        onClick={handleProfilePicClick}
                    >
                        <Camera className="text-white text-xl"/>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleProfilePhotoOnChange}
                    accept="image/*"
                />
            </div>

            <div className="flex-1">
                {isEdited ? (
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-2xl font-bold text-indigo-700 border-b border-indigo-300 focus:outline-none"
                        />
                        <button
                            onClick={handleUsernameOnChange}
                            className="text-green-600 hover:underline cursor-pointer"
                        >
                            <Check className='w-5' />
                        </button>
                        <button
                            onClick={() => {
                                setUsername(data?.user.username || "");
                                setIsEdited(false);
                            }}
                            className="text-red-500 hover:underline cursor-pointer"
                        >
                            <X className='w-5'/>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold text-indigo-700">{data?.user.username}</h2>
                        <Pencil className="ml-2 cursor-pointer w-4 text-indigo-800"
                            onClick={() => setIsEdited(true)}/>
                    </div>
                )}
                <p className="text-gray-600">{data?.user.email}</p>
                {updateError && 'data' in updateError && (
                    <p className="text-red-600 text-sm text-center mt-1">
                        {(updateError.data as any)?.message || 'Something went wrong. Please try again.'}
                    </p>
                )}
            </div>
        </div>
    );
}

export default UserData;

