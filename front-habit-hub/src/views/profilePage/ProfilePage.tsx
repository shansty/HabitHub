import React, { use, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetUserDataQuery } from '../../services/user';
import { getToken, getIDFromToken } from '../../utils';
import Modal from '../authPage/utils_components/Modal';
import profile from '../../assets/profile.png'

const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const token = getToken();
    const userId = getIDFromToken(token);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading, error } = useGetUserDataQuery(userId);
    const profilePic = data?.user.profile_picture instanceof File
            ? URL.createObjectURL(data.user.profile_picture)
            : data?.user.profile_picture || profile;

    const getProfileSrc = () => {

    }
    console.log(data)

    const habits = [
        { id: 1, name: 'Drink Water', progress: 80 },
        { id: 2, name: 'Read 10 pages', progress: 60 },
        { id: 3, name: 'Meditate', progress: 30 },
    ];

    const highProgressHabits = habits.filter(h => h.progress >= 50).length;

    useEffect(() => {
        if (!token) {
            setIsModalOpen(true)
        }
    })

    const handleOnModalClose = () => {
        setIsModalOpen(false);
        navigate('/login');
    };


    return (
        <div className="min-h-screen bg-blue-800 flex center items-center justify-center">
            <div className="w-full max-w-350 bg-white rounded-xl p-8 space-y-3">
                {!token && isModalOpen &&
                    <Modal
                        onClose={handleOnModalClose}
                        isOpen={true}
                        title="Your session has expired"
                        message='You need to log in to access the data' />}

                {/* Header */}
                {data && (
                    <div className="flex items-center space-x-6">
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover shadow"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-700">{data.user.username}</h2>
                            <p className="text-gray-600">{data.user.email} </p>
                        </div>
                        <button className="text-md ml-auto font-bold text-gray-600 cursor-pointer">Edit profile</button>
                    </div>
                )}


                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-indigo-700">{habits.length}</p>
                        <p className="text-sm text-gray-600">Active Habits</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-indigo-700">{highProgressHabits}</p>
                        <p className="text-sm text-gray-600">Over 50% Complete</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                    </div>
                </div>


                <div>
                    <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                        Your Habits
                        <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-1 rounded-full cursor-pointer ml-10">
                            <Plus />
                        </button>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {habits.map(habit => (
                            <div
                                key={habit.id}
                                className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
                            >
                                <p className="font-medium text-gray-800">{habit.name}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: `${habit.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{habit.progress}% complete</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
