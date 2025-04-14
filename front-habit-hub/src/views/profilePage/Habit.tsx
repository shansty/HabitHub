import React, { useState, useEffect } from 'react';
import { TypeUserHabitsList } from '../../types';
import { useDeleteHabitMutation } from '../../services/habit';

interface HabitProps {
    habit: TypeUserHabitsList;
    selectedDate: Date;
}

const Habit: React.FC<HabitProps> = ({ habit, selectedDate }) => {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [loggingHabitId, setLoggingHabitId] = useState<number | null>(null);
    const [logValue, setLogValue] = useState<string>('');
    const [isToday, setIsToday] = useState(true)
    const [deleteHabit, refetch] = useDeleteHabitMutation();


    const handleMenuOpen = (id: number) => setOpenMenuId(id);
    const handleMenuClose = () => setOpenMenuId(null);

    useEffect(() => {
        if (selectedDate.toDateString() === new Date().toDateString()) {
            setIsToday(false)
        } else {
            setIsToday(true)
        }

    }, [selectedDate])

    const handleLogSubmit = (habitId: number) => {
        // add logiv for editing habit event
        setLoggingHabitId(null);
        setLogValue('');
    };

    const handleDeleteHabit = async (habitId: number, e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        await deleteHabit(habitId).unwrap();
    }

    return (
        <div className="space-y-5 mt-10">
            <div
                key={habit.id}
                className="flex items-center justify-between rounded-xl px-5 py-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
                <div className="flex items-center space-x-4">
                    <div className="text-4xl">{habit.icon}</div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                        <p className="text-sm text-gray-500">
                            Progress: <span className="font-medium">{habit.value}</span> / {habit.goal} {habit.unit}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {loggingHabitId === habit.id && !isToday ? (
                        <input
                            type="text"
                            className="px-3 py-1 border rounded-md text-sm w-24"
                            value={logValue}
                            onChange={(e) => setLogValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleLogSubmit(habit.id);
                                }
                            }}
                            onBlur={() => setLoggingHabitId(null)}
                            autoFocus
                        />
                    ) : (
                        <button
                            className="flex items-center px-4 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                            onClick={() => setLoggingHabitId(habit.id)}
                        >
                            ⌨️ Log
                        </button>
                    )}

                    <div className="relative inline-block text-left">
                        <button
                            className="text-sm py-1 text-white bg-indigo-600 transition w-7 rounded-md"
                            onClick={() =>
                                openMenuId === habit.id
                                    ? handleMenuClose()
                                    : handleMenuOpen(habit.id)
                            }
                        >
                            ⋮
                        </button>

                        {openMenuId === habit.id && (
                            <div
                                onMouseLeave={handleMenuClose}
                                className="absolute mt-2 w-auto bg-white border border-indigo-700 rounded-md shadow-lg z-50"
                            >
                                <ul className="py-1 text-sm text-gray-700">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={(e) => handleDeleteHabit(habit.id, e)}
                                    >
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Habit;
