import React, { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Schedule } from '../../../enums';
import { formatString } from '../../../utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HabitCreateData } from '../../../types';

const weekDays = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 7 },
];
const defaultDays = [1, 2, 3, 4, 5, 6, 7];

interface HabitScheduleDropdownProps {
  setFormData: React.Dispatch<React.SetStateAction<HabitCreateData>>;
  habitSchedule?: {
    type: Schedule;
    daysOfWeek: number[];
    daysOfMonth: number[];
  };
}

const HabitScheduleDropdown: React.FC<HabitScheduleDropdownProps> = ({ setFormData, habitSchedule }) => {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>(Schedule.DAILY);
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);


  useEffect(() => {
    if (!habitSchedule) {
      initDefaultSchedule();
      return;
    }
    const { type, daysOfWeek, daysOfMonth } = habitSchedule;
    setSelectedSchedule(type);
    if (type === Schedule.DAILY && daysOfWeek.length > 0) {
      setSelectedWeekdays(daysOfWeek);
      updateScheduleFormData(Schedule.DAILY, daysOfWeek);
    }
    if (type === Schedule.MONTHLY && daysOfMonth.length > 0) {
      handleMonthlySetup(daysOfMonth);
    }
  }, [habitSchedule]);


  const handleMonthlySetup = (daysOfMonth: number[]) => {
    const today = new Date();
    const dates = daysOfMonth.map(day => new Date(today.getFullYear(), today.getMonth(), day));
    setSelectedDates(dates);
    updateScheduleFormData(Schedule.MONTHLY, daysOfMonth)
  };


  const initDefaultSchedule = () => {
    setSelectedSchedule(Schedule.DAILY);
    setSelectedWeekdays(defaultDays);
    updateScheduleFormData(Schedule.DAILY, defaultDays)
  };


  const updateScheduleFormData = (scheduleType: Schedule, daysOfWeek: number[] = [], daysOfMonth: number[] = []) => {
    setFormData(prev => ({
      ...prev,
      habitSchedule: scheduleType,
      habitScheduleData: {
        daysOfWeek,
        daysOfMonth,
      },
    }));
  };


  const handleWeekdaySelect = (day: number) => {
    setSelectedWeekdays((prev) => {
      const updated = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      if (selectedSchedule === Schedule.DAILY) {
        updateScheduleFormData(Schedule.DAILY, updated);
      }
      return updated;
    });
  };



  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    const dayOfMonth = date.getDate();
    setSelectedDates((prevDates) => {
      const alreadySelected = prevDates.some((d) => d.getDate() === dayOfMonth);
      const updated = alreadySelected
        ? prevDates.filter((d) => d.getDate() !== dayOfMonth)
        : [...prevDates, date];
        if (selectedSchedule === Schedule.MONTHLY) {
          updateScheduleFormData(Schedule.MONTHLY, [], updated.map((d) => d.getDate()));
        }
      return updated;
    });
  };


  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="border px-4 py-2 rounded-md w-full text-left">
          {formatString(selectedSchedule)}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={5}
        align="start"
        className="bg-white border-1 shadow-lg rounded-md p-2 min-w-auto h-21 z-50"
      >
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger
            onMouseEnter={() => setSelectedSchedule(Schedule.DAILY)}
            className="px-4 py-1 rounded-md flex justify-between items-center w-full"
          >
            {formatString(Schedule.DAILY)} →
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent className="ml-2 bg-white shadow-md rounded-md p-3 grid grid-cols-2 gap-2 w-48 z-50">
            {weekDays.map((day) => (
              <DropdownMenu.Item asChild key={day.value}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleWeekdaySelect(day.value);
                  }}
                  className={`border px-1 py-1 rounded-md ${selectedWeekdays.includes(day.value)
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                    }`}
                >
                  {day.label}
                </button>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger
            onMouseEnter={() => setSelectedSchedule(Schedule.MONTHLY)}
            className="px-4 py-1 mt-1 rounded flex justify-between items-center w-full"
          >
            {formatString(Schedule.MONTHLY)} →
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent className="ml-2 shadow-md rounded-md p-3 w-auto">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DatePicker
                inline
                onChange={handleDateSelect}
                highlightDates={selectedDates}
              />
            </div>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HabitScheduleDropdown;
