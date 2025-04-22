import React from 'react';
import { differenceInDays, format } from 'date-fns';
import { UsersHabitDetailedResponseData } from '../../../types';
import { formatFieldName, formatString } from '../../../utils';


interface HabitDetailProps {
    habit: UsersHabitDetailedResponseData
}

const HabitDetail: React.FC<HabitDetailProps> = ({ habit }) => {

    const today = new Date();
    const daysSinceStart = differenceInDays(today, new Date(habit.startDate || today));
    const daysLeft = (habit.goalDuration || 0) - daysSinceStart;

    return (

        <div className="max-w-3xl px-6">
            <div className="flex items-center justify-between pb-4 mb-6">
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

            <h2 className='mb-3 text-lg font-bold'>Habit detail</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-sm text-gray-900 font-semibold ml-5">
                <div>
                    <span className="font-medium text-indigo-900">Category:</span><br />
                    {formatString(habit.category || "")}
                </div>
                <div>
                    <span className="font-medium text-indigo-900">Start Date:</span><br />
                    {habit.startDate ? format(new Date(habit.startDate), 'yyyy-MM-dd') : 'N/A'}
                </div>
                <div>
                    <span className="font-medium text-indigo-900">Completed Days:</span><br />
                    {habit.totalNumberOfCompletedDays ?? 0}
                </div>
                <div>
                    <span className="font-medium text-indigo-900">Total Quantity:</span><br />
                    {habit.totalValueQuantity ?? 0} {formatString(habit.unit)}
                </div>
                <div>
                    <span className="font-medium text-indigo-900">Days Left:</span><br />
                    {daysLeft > 0 ? daysLeft : 'Completed'}
                </div>
               <div>
                    <span className="font-medium text-indigo-900">Habit status</span><br />
                    {formatFieldName(habit.status)}
                </div>
            </div>
        </div>
    );
}

export default HabitDetail;
