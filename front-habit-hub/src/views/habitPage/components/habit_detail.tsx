import React from 'react';
import { differenceInDays, format } from 'date-fns';
import { UsersHabitDetailedResponseData } from '../../../types';
import { formatFieldName, formatString } from '../../../utils';
import { HabitStatus } from '../../../enums';

interface HabitDetailProps {
    habit: UsersHabitDetailedResponseData
}

const HabitDetail: React.FC<HabitDetailProps> = ({ habit }) => {

    const today = new Date();
    const daysSinceStart = differenceInDays(today, new Date(habit.startDate || today));
    const daysLeft = (habit.goalDuration || 0) - daysSinceStart;
    const statusColor = habit.status === HabitStatus.ABANDONED ? 'text-red-500'
        : habit.status === HabitStatus.COMPLETED ? 'text-green-600' : 'text-indigo-900';

    return (

        <div className="max-w-3xl px-6">
            <h2 className='mb-3 text-lg font-bold'>📋 Habit detail</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-900 font-semibold">
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
                    <span className={`font-medium  text-indigo-900`}>Habit status</span><br />
                    <span className={`${statusColor}`}>{formatFieldName(habit.status)}</span>
                </div>
            </div>
        </div>
    );
}

export default HabitDetail;
