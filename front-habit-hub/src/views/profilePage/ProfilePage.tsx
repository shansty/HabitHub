import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils';
import Modal from '../authPage/utils_components/Modal';
import UserData from './UserData';
import HabitList from './HabitList';


const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const token = getToken();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const habits = [
        { id: 1, name: 'Drink Water', progcategoriesress: 80 },
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

    const onAddHabits = ( ) => {

    }


    return (
        <div className="min-h-screen bg-blue-800 flex center items-center justify-center">
            <div className="w-full max-w-350 bg-white rounded-xl p-8 space-y-3 mt-20 mb-20">
                {!token && isModalOpen &&
                    <Modal
                        onClose={handleOnModalClose}
                        isOpen={true}
                        title="Your session has expired"
                        message='You need to log in to access the data' />}
                <UserData />
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
            <HabitList habits={habits}/>
            </div>
        </div>
    );
};

export default UserProfilePage;
