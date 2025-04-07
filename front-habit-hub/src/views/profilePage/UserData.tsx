import React, { useState } from 'react';
import { useGetUserDataQuery, useUpdateUserProfileMutation } from '../../services/user';
import { getToken, getIDFromToken } from '../../utils';
import profile from '../../assets/profile.png'
import { TypeUserProfile } from '../../types';
import InputField from '../authPage/utils_components/InputField';


const UserData: React.FC = () => {
    const token = getToken();
    const userId = getIDFromToken(token);
    const { data} = useGetUserDataQuery(userId);
    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState<TypeUserProfile>()

    const [updateUserProfile, { error: updateError }] = useUpdateUserProfileMutation();

    const profilePic = data?.user.profile_picture
    ? `http://localhost:3000/uploads/${data.user.profile_picture}`
    : profile;



    const handleUsernameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditUser((prev) => ({
            ...prev,
            username: e.target.value,
        }));
    };

    const handleProfilePhotoOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setEditUser((prev) => ({
                ...prev,
                profile_picture: e.target.files![0],
            }));
        }
    };


    const handleCancel = () => {
        setIsEditing(false);
        setEditUser({})
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('username', editUser?.username as string);
        console.dir({ editUser })
        if (editUser?.profile_picture) {
            formData.append('profile_picture', editUser?.profile_picture as File);
        }
        console.dir({ formData })
        await updateUserProfile(formData);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };


    return (
        <div className="flex items-start space-x-6 w-full">
            <img
                src={profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover shadow"
            />

            <div className="flex-1">
                {isEditing ? (
                    <div className="space-y-2 max-w-lg">
                        <InputField
                            type="text"
                            value={editUser?.username}
                            handleOnChange={handleUsernameOnChange}
                            id="username"
                            placeholder='Enter new username'
                        />
                        <InputField
                            type="file"
                            handleOnChange={handleProfilePhotoOnChange}
                            id="profile_picture"
                        />
                        <div className="flex space-x-2 mt-2">
                            <button
                                onClick={handleSave}
                                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-700">{data?.user.username}</h2>
                        <p className="text-gray-600">{data?.user.email}</p>
                        {updateError && 'data' in updateError && (
                            <p className="text-red-600 text-sm text-center mt-1">
                                {(updateError.data as any)?.message || 'Something went wrong. Please try again.'}
                            </p>
                        )}
                        <button
                            onClick={handleEditClick}
                            className="text-md ml-auto font-bold text-gray-600 cursor-pointer"
                        >
                            Edit profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserData;

