import React from 'react';
import { UsersHabitDetailedResponseData } from '../../../types';
import { formatString } from '../../../utils'; 

interface HabitHeaderProps {
    habit: UsersHabitDetailedResponseData
}

const HabitHeader: React.FC<HabitHeaderProps> = ({ habit }) => {
    return (
        <div className="flex items-center pb-10">
            <div className="flex items-center space-x-4">
                <div className="text-5xl">{habit.icon}</div>
                <div>
                    <h1 className="text-2xl font-bold ">{habit.name}</h1>
                    <p className="text-sm text-gray-500">
                        {habit.goal} {formatString(habit.unit)} {habit.goalPeriodicity?.toLowerCase().replace('_', ' ')}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HabitHeader;
