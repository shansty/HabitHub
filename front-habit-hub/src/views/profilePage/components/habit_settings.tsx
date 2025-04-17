import React from 'react';
import { useDeleteHabitMutation } from '../../../services/habit';

interface HabitSettingsProps {
    habitId: number;
    setIsFormOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const HabitSettings: React.FC<HabitSettingsProps> = ({ habitId, setIsFormOpened }) => {
    const [deleteHabit] = useDeleteHabitMutation();

    const handleDeleteHabit = async (habitId: number, e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        await deleteHabit(habitId).unwrap();
    }

    const handleEditHabit = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        setIsFormOpened(true);
    };

    return (
        <>
            <ul className="py-1 text-sm text-gray-700">
                <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => handleEditHabit(e)}
                >
                    Edit
                </li>
                <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => handleDeleteHabit(habitId, e)}
                >
                    Delete
                </li>
            </ul>
        </>
    );
}

export default HabitSettings;
