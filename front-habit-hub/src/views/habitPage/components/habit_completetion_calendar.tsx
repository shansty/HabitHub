import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { isSameDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { UsersHabitDetailedResponseData } from '../../../types';

interface HabitCompletionCalendarProps {
    habit: UsersHabitDetailedResponseData;
}


const HabitCompletionCalendar: React.FC<HabitCompletionCalendarProps> = ({ habit }) => {
    const [startDate, setStartDate] = useState(new Date());

    const isScheduled = (calendar_date: Date) =>
        habit.habitDailyData.some(d => isSameDay(new Date(d.date), calendar_date));

    const isCompleted = (date: Date) =>
        habit.habitDailyData.some(d => isSameDay(new Date(d.date), date) && d.isGoalCompleted);

    const handleDayClick = (date: Date | null) => {
        if(!date) return
        setStartDate(date)
    };

    return (
        <div className="max-w-3xl px-6 mt-5">
            <h2 className="mb-3 text-lg font-bold">Habit Calendar</h2>
            <DatePicker
                inline
                selected={startDate}
                onChange={handleDayClick}
                dayClassName={(calendar_date: Date) => {
                    if (isScheduled(calendar_date)) {
                        return isCompleted(calendar_date)
                            ? 'bg-green-300 cursor-pointer '
                            : 'bg-purple-300 cursor-pointer ';
                    }
                    return '';
                }}
            />
            <p className="text-xs text-gray-500 mt-2">
            🟩 Green = Completed | 🟪 Purple = Scheduled | 🟦 Blue = Selected
            </p>
        </div>
    );
};

export default HabitCompletionCalendar;
