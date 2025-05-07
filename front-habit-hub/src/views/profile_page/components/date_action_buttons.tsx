import React from 'react';
import DatePicker from 'react-datepicker';
import { Keyboard } from 'lucide-react';

interface DateActionBarProps {
  selectedDate: Date;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onDateChange: (date: Date) => void;
  onAddHabit: () => void;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  getDateLabel: () => string;
}

const DateActionBar: React.FC<DateActionBarProps> = ({
  selectedDate,
  showCalendar,
  onToggleCalendar,
  onDateChange,
  onAddHabit,
  calendarRef,
  getDateLabel,
}) => {
  return (
    <div
      className="relative flex flex-row items-end sm:items-center gap-2"
      ref={calendarRef}
    >
      <button
        onClick={onToggleCalendar}
        className="text-indigo-700 font-medium border px-3 py-2 rounded-md sm:w-full min-w-auto text-nowrap flex items-center gap-2"
      >
        <Keyboard />
        {getDateLabel()}
      </button>
      <button
        onClick={onAddHabit}
        className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md sm:w-full min-w-auto text-nowrap"
      >
        Add Habit
      </button>

      {showCalendar && (
        <div className="absolute top-10 mr-20 z-10 shadow-lg bg-white p-2 rounded">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              if (date) {
                onDateChange(date);
              }
            }}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DateActionBar;
