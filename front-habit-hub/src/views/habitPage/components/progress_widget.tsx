import React from 'react';
import { HabitStatus } from '../../../enums';
import { UsersHabitDetailedResponseData } from '../../../types';
import { formatString } from '../../../utils';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface HabitProgressTrackerProps {
    habit: UsersHabitDetailedResponseData;
}

const HabitProgressWidget: React.FC<HabitProgressTrackerProps> = ({ habit }) => {
    const totalScheduled = habit.habitDailyData.length;
    const totalGoal = habit.goal * totalScheduled;
    const totalLogged = habit.habitDailyData.reduce((p, c) => p + (c.value || 0), 0);
    const isCompleted = habit.progress === 100 || habit.status === HabitStatus.COMPLETED
    const isAbandoned = habit.status == HabitStatus.ABANDONED

    const pathColor = isAbandoned ? '#ef4444' : isCompleted ? '#16a34a' : '#4F46E5';
    const trailColor = '#c5c3e6';
    const textColor = isAbandoned ? '#ef4444' : isCompleted ? '#0a662c' : '#111827';
    const loggedTextColor = isAbandoned ? 'text-red-500' : isCompleted ? 'text-green-600' : 'text-gray-800';

    return (
        <div className="flex flex-col p-4">
            <h2 className="text-lg font-bold mb-3">🔥 Habit Progress</h2>
            <div className="w-32 h-32 ml-4">
                <CircularProgressbar
                    value={habit.progress}
                    maxValue={100}
                    text={`${habit.progress}%`} 
                    strokeWidth={14} 
                    styles={buildStyles({
                        textColor,
                        pathColor,
                        trailColor,
                    })}
                />
            </div>
            <p className="text-sm text-gray-900 mt-3">
                Total Logged:
                <span className={`font-bold ml-1 ${loggedTextColor}`}>{totalLogged}</span>
                / {totalGoal} {formatString(habit.unit)}
            </p>

        </div>
    );
};

export default HabitProgressWidget;
