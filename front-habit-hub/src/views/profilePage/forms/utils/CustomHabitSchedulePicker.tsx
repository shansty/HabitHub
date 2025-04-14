import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HabitScheduleEnum } from '../../../../enums';
import { formatString } from '../../../../utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TypeHabitFormState } from '../../../../types';

const weekDays = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 7 },
];

interface HabitScheduleDropdownProps {
  setFormData: React.Dispatch<React.SetStateAction<TypeHabitFormState>>;
}

const HabitScheduleDropdown: React.FC<HabitScheduleDropdownProps> = ({ setFormData }) => {
  const [selectedSchedule, setSelectedSchedule] = useState<HabitScheduleEnum>(HabitScheduleEnum.DAILY);
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays((prev) => {
      const updated = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      setFormData((prevForm) => ({
        ...prevForm,
        habitSchedule: HabitScheduleEnum.DAILY,
        habitScheduleData: {
          daysOfWeek: updated,
          daysOfMonth: [],
        },
      }));
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

      setFormData((prevForm) => ({
        ...prevForm,
        habitSchedule: HabitScheduleEnum.MONTHLY,
        habitScheduleData: {
          daysOfWeek: [],
          daysOfMonth: updated.map((d) => d.getDate()),
        },
      }));

      return updated;
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="border px-4 py-2 rounded-md w-full text-left">
          {formatString(selectedSchedule)}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={5}
        align="start"
        className="bg-white border-1 shadow-lg rounded-md p-2 min-w-auto h-21 z-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger
            className="px-4 py-1 rounded-md flex justify-between items-center w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
            onMouseEnter={() => setSelectedSchedule(HabitScheduleEnum.DAILY)}
          >
            {formatString(HabitScheduleEnum.DAILY)}→
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent
            className="ml-2 bg-white shadow-md rounded-md p-3 grid grid-cols-2 gap-2 w-48 z-50"
          >
            {weekDays.map((day) => (
              <button
                type="button"
                key={day.value}
                onClick={() => toggleWeekday(day.value)}
                className={`border px-1 py-1 rounded-md ${selectedWeekdays.includes(day.value)
                  ? "bg-indigo-600 text-white"
                  : "bg-white"
                  }`}
              >
                {day.label}
              </button>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>


        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger
            className="px-4 py-1 mt-1 rounded flex justify-between items-center w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
            onMouseEnter={() => setSelectedSchedule(HabitScheduleEnum.MONTHLY)}
          >
            {formatString(HabitScheduleEnum.MONTHLY)}→
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent className="ml-2 shadow-md rounded-md p-3 w-auto">
            <DatePicker
              inline
              onChange={handleDateSelect}
              highlightDates={selectedDates}
            />
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HabitScheduleDropdown;
