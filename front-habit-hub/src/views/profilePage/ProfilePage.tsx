import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils';
import Modal from '../authPage/utils_components/Modal';
import UserData from './UserData';
import AddHabitForm from './AddHabitForm';
import DatePicker from 'react-datepicker';
import { format, isToday, isTomorrow } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';


const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const token = getToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpened, setIsFormOpened] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!token) {
            setIsModalOpen(true)
        }
    })

    const handleOnModalClose = () => {
        setIsModalOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const getDateLabel = () => {
        if (isToday(selectedDate)) return 'Today';
        if (isTomorrow(selectedDate)) return 'Tomorrow';
        return format(selectedDate, 'yyyy-MM-dd');
    };


    return (
        <div className="min-h-screen bg-blue-800 flex center justify-center">
            <div className="w-full max-w-350 bg-white rounded-xl p-8 space-y-3 mt-20 mb-20">
                {!token && isModalOpen &&
                    <Modal
                        onClose={handleOnModalClose}
                        isOpen={true}
                        title="Your session has expired"
                        message='You need to log in to access the data' />}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                    <UserData />

                    <div className="relative flex sm:flex-row items-start sm:items-center gap-2" ref={calendarRef}>
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="min-w-25 text-indigo-700 font-medium border px-3 py-2 rounded-md w-full sm:min-w-25"
                        >
                            {getDateLabel()}
                        </button>
                        <button
                            onClick={() => setIsFormOpened(true)}
                            className="min-w-25 bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md w-full sm:min-w-25">
                            Add Habit
                        </button>

                        {showCalendar && (
                            <div className="absolute top-10 mr-20 z-10 shadow-lg bg-white p-2 rounded">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date | null) => {
                                        if (date) {
                                            setSelectedDate(date);
                                            setShowCalendar(false);
                                        }
                                    }}
                                    inline
                                />
                            </div>
                        )}
                    </div>
                </div>
                {isFormOpened && <AddHabitForm />}
            </div>
        </div>
    );
};

export default UserProfilePage;
