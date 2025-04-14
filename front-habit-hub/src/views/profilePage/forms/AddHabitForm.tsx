import React, { useEffect, useState } from 'react';
import InputField from '../../authPage/utils_components/InputField';
import { useGetHabitCategoriesQuery, useCreateHabitMutation } from '../../../services/habit';
import { UnitOfMeasurementEnum, HabitScheduleEnum, GoalPeriodicityEnum } from '../../../enums';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SelectField from './utils/SelectField';
import InputNumber from './utils/InputNumber';
import HabitScheduleDropdown from './utils/CustomHabitSchedulePicker';
import { TypeHabitCreateData, TypeHabitFormState } from '../../../types';

interface HabitFormProps {
  onClose: () => void;
  minStartDate: Date;
  refetchHabits: () => void;
}

const AddHabitForm: React.FC<HabitFormProps> = ({ onClose, minStartDate, refetchHabits }) => {
  const [formData, setFormData] = useState<TypeHabitFormState>({
    name: '',
    goal: '1',
    goalDuration: '21',
    unit: UnitOfMeasurementEnum.TIMES,
    icon: '',
    habitSchedule: HabitScheduleEnum.DAILY,
    habitScheduleData: {
      daysOfWeek: [],
      daysOfMonth: [],
    },
    goalPeriodicity: GoalPeriodicityEnum.PER_DAY,
    startDate: new Date(),
    category: '',
  });

  const { data: categories } = useGetHabitCategoriesQuery();
  const [unitOptions, setUnitOptions] = useState<UnitOfMeasurementEnum[]>([]);
  const [iconsOptions, setIconsOptions] = useState<string[]>([]);
  const [createHabit, { isLoading }] = useCreateHabitMutation();
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    if (formData.category) {
      const found = categories?.find((category) => category.name === formData.category);
      if (found) {
        setUnitOptions(found.allowedUnits);
        setIconsOptions(found.icons);
        setFormData((prev) => ({
          ...prev,
          unit: found.defaultUnit,
          icon: found.defaultIcon,
        }));
      }
    }
  }, [formData.category, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCustomError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const preparedData: TypeHabitCreateData = {
      ...formData,
      goal: Number(formData.goal),
      goalDuration: Number(formData.goalDuration),
      startDate: formData.startDate?.toISOString().split('T')[0] || '',
    };

    try {
      await createHabit(preparedData).unwrap();
      refetchHabits(); 
      onClose();
    } catch (err: any) {
      setCustomError(err?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleBlur = (field: 'goal' | 'goalDuration', min = 1) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === '' || Number(prev[field]) < min ? String(min) : prev[field],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl text-indigo-700 font-semibold mb-4">New Habit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <InputField
            name="name"
            type="text"
            id="name"
            placeholder="Enter the name of habit"
            value={formData.name}
            handleOnChange={handleChange}
          />

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-9">
              <label className="text-sm font-medium mb-1 block">Category</label>
              <SelectField
                placeholder="Select Category"
                name="category"
                value={formData.category}
                handleOnChange={handleChange}
                array={categories?.map((c) => c.name) || []}
              />
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium mb-1 block">Icon</label>
              <SelectField
                name="icon"
                value={formData.icon}
                handleOnChange={handleChange}
                array={iconsOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 flex flex-col">
              <label className="text-sm font-medium mb-1">Goal</label>
              <InputNumber
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                onBlur={() => handleBlur('goal')}
              />
            </div>

            <div className="col-span-4 flex flex-col">
              <label className="text-sm font-medium mb-1">Unit</label>
              <SelectField
                name="unit"
                value={formData.unit}
                handleOnChange={handleChange}
                array={unitOptions}
              />
            </div>

            <div className="col-span-5 flex flex-col">
              <label className="text-sm font-medium mb-1">Periodicity</label>
              <SelectField
                name="goalPeriodicity"
                value={formData.goalPeriodicity}
                handleOnChange={handleChange}
                array={Object.values(GoalPeriodicityEnum)}
              />
            </div>
          </div>

  
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 flex flex-col">
              <label className="text-sm font-medium mb-1">Duration</label>
              <InputNumber
                min={21}
                name="goalDuration"
                value={formData.goalDuration}
                onChange={handleChange}
                onBlur={() => handleBlur('goalDuration', 21)}
              />
            </div>

            <div className="col-span-4 flex flex-col">
              <label className="text-sm font-medium mb-1">Repeat</label>
              <HabitScheduleDropdown setFormData={setFormData} />
            </div>

            <div className="col-span-5 flex flex-col">
              <label className="text-sm font-medium mb-1">Start Date</label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date: Date | null) => {
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date ?? new Date(),
                  }));
                }}
                minDate={minStartDate}
                dateFormat="yyyy-MM-dd"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>

          {customError && (
            <p className="text-red-600 text-sm text-center mt-1">{customError}</p>
          )}
          {isLoading && <p className="text-sm text-center text-indigo-600">Saving...</p>}
        </form>
      </div>
    </div>
  );
};

export default AddHabitForm;
