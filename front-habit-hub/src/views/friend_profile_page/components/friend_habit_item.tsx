import React from 'react';
import { UsersHabitPreviewResponseData } from '../../../types';
import { CheckCheck } from 'lucide-react';
import { formatString } from '../../../utils';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface FriendHabitProps {
  habit: UsersHabitPreviewResponseData;
}

const FriendHabit: React.FC<FriendHabitProps> = ({ habit }) => {
  return (
    <div className="space-y-5 mt-10">
      <div
        key={habit.id}
        className="flex items-center justify-between rounded-md px-5 py-4 bg-white shadow-sm"
      >
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{habit.icon}</div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {habit.name}
              {habit.isGoalCompleted && (
                <CheckCheck className="text-lime-500" />
              )}
            </h3>
            <p className="text-sm text-gray-500">
              Progress:{' '}
              <span
                className={`font-medium ${
                  habit.isGoalCompleted ? 'text-lime-500' : ''
                }`}
              >
                {habit.value}
              </span>{' '}
              / {habit.goal} {formatString(habit.unit)}
            </p>
          </div>
        </div>

        <div className="w-14 h-14">
          <CircularProgressbar
            value={habit.progress}
            text={`${Math.round(habit.progress)}%`}
            styles={buildStyles({
              pathColor: habit.isGoalCompleted ? '#84cc16' : '#3b82f6',
              textColor: '#111827',
              trailColor: '#c5c3e6',
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default FriendHabit;
