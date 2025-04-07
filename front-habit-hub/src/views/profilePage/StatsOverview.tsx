import React from 'react';

interface StatsOverviewProps {
  totalHabits: number;
  highProgressHabits: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ totalHabits, highProgressHabits }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-lg font-semibold text-indigo-700">{totalHabits}</p>
        <p className="text-sm text-gray-600">Active Habits</p>
      </div>
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-lg font-semibold text-indigo-700">{highProgressHabits}</p>
        <p className="text-sm text-gray-600">Over 50% Complete</p>
      </div>
      <div className="bg-indigo-50 p-4 rounded-lg">{/* Add more stats if needed */}</div>
    </div>
  );
};

export default StatsOverview;

