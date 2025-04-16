import React, { useState, useEffect, useRef } from 'react';
import { TypeUserHabitsList } from '../../../types';
import { useLazyGetUserHabitsByDateQuery } from '../../../services/habit';
import { useAddEventValueMutation } from '../../../services/habit_event';
import HabitForm from '../forms/HabitForm';
import { CheckCheck } from 'lucide-react';
import { formatString } from '../../../utils';
import ErrorHandling from '../../../utils_components/ErrorHandling';
import HabitSettings from './HabitSettings';
import { useClickOutside } from '../../../hooks';


interface HabitProps {
    habit: TypeUserHabitsList;
    selectedDate: Date;
}

const Habit: React.FC<HabitProps> = ({ habit, selectedDate }) => {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [loggingHabitId, setLoggingHabitId] = useState<number | null>(null);
    const [logValue, setLogValue] = useState<string>('');
    const [isToday, setIsToday] = useState(true)
    const [isFormOpened, setIsFormOpened] = useState(false)
    const [customError, setCustomError] = useState<string | null>(null);

    const [addEventValue] = useAddEventValueMutation()
    const [triggerRefetchHabits] = useLazyGetUserHabitsByDateQuery();

    const handleMenuOpen = (id: number) => setOpenMenuId(id);
    const handleMenuClose = () => setOpenMenuId(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setOpenMenuId(null));

    useEffect(() => {
        if (selectedDate.toDateString() === new Date().toDateString()) {
            setIsToday(false)
        } else {
            setIsToday(true)
        }
    }, [selectedDate])


    const handleLogSubmit = async (habitId: number) => {
        try {
            await addEventValue({ habitId, logValue: Number(logValue), date: selectedDate }).unwrap();
        } catch (err: any) {
            setCustomError(err?.data?.message);
        }
        const formattedDate = selectedDate.toISOString().split('T')[0];
        await triggerRefetchHabits(formattedDate);
        setLoggingHabitId(null);
        setLogValue('');
    };


    const handleLoginClick = (habitId: number) => {
        setLoggingHabitId(habitId);
        setCustomError(null)
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
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            {habit.name}
                            {habit.isGoalCompleted && (
                                <CheckCheck className='text-lime-500' />
                            )}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Progress: <span className={`font-medium ${habit.isGoalCompleted ? 'text-lime-500' : ""}`}>{habit.value}</span> / {habit.goal} {formatString(habit.unit)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {loggingHabitId === habit.id && !isToday ? (
                        <input
                            type="text"
                            className="px-1 py-1 bg-indigo-600 text-white rounded-md text-sm w-20"
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
                    ) : (<>
                        <ErrorHandling customError={customError} />
                        <button
                            className="flex items-center px-4 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                            onClick={() => handleLoginClick(habit.id)}
                        >
                            ⌨️ Log
                        </button>
                    </>)}

                    <div className="relative inline-block text-left">
                        <button
                            className="text-sm py-1 text-white bg-indigo-600 transition w-7 rounded-md"
                            onClick={() =>
                                openMenuId === habit.id
                                    ? handleMenuClose()
                                    : handleMenuOpen(habit.id)
                            }
                        > ⋮ </button>

                        {openMenuId === habit.id && (
                            <div
                                ref={dropdownRef}
                                className="absolute mt-2 w-auto bg-white border border-indigo-700 rounded-md shadow-lg z-50"
                            >
                                <HabitSettings habitId={habit.id} setIsFormOpened={setIsFormOpened} />
                                {isFormOpened && (
                                    <HabitForm
                                        onClose={() => setIsFormOpened(false)}
                                        minStartDate={new Date()}
                                        habit={habit}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Habit;
