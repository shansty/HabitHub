import React, { useState, useRef, useEffect } from 'react'
import {
    useGetUserDataQuery,
    useUpdateUserProfileMutation,
} from '../../../services/user'
import { getToken, getIDFromToken } from '../../../utils'
import profile from '../../../assets/profile.png'
import { Camera, Check, Pencil, X } from 'lucide-react'
import ErrorHandling from '../../../utils_components/error_handling'

const UserData: React.FC = () => {
    const token = getToken()
    const userId = getIDFromToken(token)
    const [isHovered, setIsHovered] = useState(false)
    const [isEdited, setIsEdited] = useState(false)
    const [username, setUsername] = useState('')
    const [customError, setCustomError] = useState<string | null>(null)
    const { data, refetch } = useGetUserDataQuery(userId)
    const [updateUserProfile] = useUpdateUserProfileMutation()
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const profilePic = data?.user.profile_picture
        ? `${import.meta.env.VITE_LOCAL_HOST}/uploads/${data.user.profile_picture}`
        : profile

    useEffect(() => {
        if (data?.user.username) {
            setUsername(data.user.username)
        }
    }, [data?.user.username])

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    const handleProfilePicClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleProfilePhotoOnChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCustomError(null)
        const formData = new FormData()
        if (e.target.files && e.target.files.length > 0) {
            formData.append('profile_picture', e.target.files[0])
            try {
                await updateUserProfile(formData).unwrap()
                refetch()
            } catch (err: any) {
                setCustomError(err?.data?.message)
            }
        }
    }

    const handleUsernameOnClick = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('username', username)
        try {
            await updateUserProfile(formData).unwrap()
            setIsEdited(false)
            refetch()
        } catch (err: any) {
            setCustomError(err?.data?.message)
        }
    }

    const handleUsernameOnClange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
        setCustomError(null)
    }

    return (
        <div className="flex items-start space-x-6 w-full">
            <div
                className="relative w-16 h-16"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={profilePic}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover shadow"
                />
                {isHovered && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 rounded-full cursor-pointer"
                        onClick={handleProfilePicClick}
                    >
                        <Camera className="text-white text-xl" />
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
                            onChange={handleUsernameOnClange}
                            className="text-2xl font-bold text-indigo-700 border-b border-indigo-300 focus:outline-none"
                        />
                        <button
                            onClick={handleUsernameOnClick}
                            className="text-green-600 hover:underline cursor-pointer"
                        >
                            <Check className="w-5" />
                        </button>
                        <button
                            onClick={() => {
                                setUsername(data?.user.username || '')
                                setIsEdited(false)
                            }}
                            className="text-red-500 hover:underline cursor-pointer"
                        >
                            <X className="w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold text-indigo-700">
                            {data?.user.username}
                        </h2>
                        <Pencil
                            className="ml-2 cursor-pointer w-4 text-indigo-800"
                            onClick={() => setIsEdited(true)}
                        />
                    </div>
                )}
                <p className="text-gray-600">{data?.user.email}</p>
                <ErrorHandling customError={customError} />
            </div>
        </div>
    )
}

export default UserData
