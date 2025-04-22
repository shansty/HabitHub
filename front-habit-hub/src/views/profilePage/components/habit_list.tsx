import React from 'react';
import { UsersHabitPreviewResponseData } from '../../../types';
import Habit from './habit_item';

interface HabitListProps {
    habits: UsersHabitPreviewResponseData[] | undefined;
    selectedDate: Date;
}

const HabitList: React.FC<HabitListProps> = ({ habits, selectedDate }) => {

    const sortedHabits = habits?.slice().sort((a, b) => {
        return Number(a.isGoalCompleted) - Number(b.isGoalCompleted);
      });
   
    return (
        <div className="space-y-5 mt-10">
            {sortedHabits  && sortedHabits.length > 0 ? (
                sortedHabits.map((habit) => (
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
