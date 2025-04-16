import React from 'react';
import { TypeUserHabitsList } from '../../../types';
import Habit from './Habit';

interface HabitListProps {
    habits: TypeUserHabitsList[] | undefined;
    selectedDate: Date;
}

const HabitList: React.FC<HabitListProps> = ({ habits, selectedDate }) => {
   
    return (
        <div className="space-y-5 mt-10">
            {habits && habits.length > 0 ? (
                habits.map((habit) => (
                    <Habit habit={habit} selectedDate={selectedDate} key={habit.id}/> 
                ))
            ) : (
                <p className="text-center text-gray-400 mt-8 text-sm">
                    You don’t have any habits for this date yet.
                </p>
            )}
        </div>
    );
};

export default HabitList;
