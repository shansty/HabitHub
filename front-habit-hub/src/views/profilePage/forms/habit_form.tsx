import React, { useEffect, useState } from 'react'
import InputField from '../../../utils_components/input_field'
import {
    useGetHabitCategoriesQuery,
    useCreateHabitMutation,
    useEditHabitMutation,
} from '../../../services/habit'
import { UnitOfMeasurement, Schedule, GoalPeriodicity } from '../../../enums'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import SelectField from '../../../utils_components/select_field'
import InputNumber from '../../../utils_components/input_number'
import HabitScheduleDropdown from '../components/custom_habit_schedule_picker'
import { HabitCreateData, UsersHabitPreviewResponseData } from '../../../types'
import ErrorHandling from '../../../utils_components/error_handling'

interface HabitFormProps {
    onClose: () => void
    minStartDate: Date
    habit?: UsersHabitPreviewResponseData
}

const HabitForm: React.FC<HabitFormProps> = ({
    onClose,
    minStartDate,
    habit,
}) => {
    const [formData, setFormData] = useState<HabitCreateData>({
        name: habit?.name ?? '',
        category: habit?.category ?? '',
        goal: habit?.goal ?? 1,
        goalDuration: 21,
        unit: (habit?.unit as UnitOfMeasurement) ?? UnitOfMeasurement.TIMES,
        icon: habit?.icon ?? '',
        habitSchedule: habit?.habitSchedule.type ?? Schedule.DAILY,
        habitScheduleData: {
            daysOfWeek: habit?.habitSchedule.daysOfWeek?.map(Number) ?? [],
            daysOfMonth: habit?.habitSchedule.daysOfMonth?.map(Number) ?? [],
        },
        goalPeriodicity: GoalPeriodicity.PER_DAY,
        startDate: new Date(),
    })

    const { data: categories } = useGetHabitCategoriesQuery()
    const [unitOptions, setUnitOptions] = useState<UnitOfMeasurement[]>([])
    const [iconsOptions, setIconsOptions] = useState<string[]>([])
    const [createHabit, { isLoading }] = useCreateHabitMutation()
    const [editHabit] = useEditHabitMutation()
    const [customError, setCustomError] = useState<string | null>(null)

    useEffect(() => {
        if (formData.category) {
            const found = categories?.find(
                (category) => category.name === formData.category
            )
            if (found) {
                setUnitOptions(found.allowedUnits)
                setIconsOptions(found.icons)
                setFormData((prev) => ({
                    ...prev,
                    unit: habit?.unit ?? found.defaultUnit,
                    icon: habit?.icon ?? found.defaultIcon,
                }))
            }
        }
    }, [formData.category, categories])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setCustomError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const preparedData: HabitCreateData = {
            ...formData,
            goal: Number(formData.goal),
            goalDuration: Number(formData.goalDuration),
            startDate: formData.startDate,
        }

        try {
            if (!habit) {
                await createHabit(preparedData).unwrap()
                onClose()
            } else {
                await editHabit({
                    habitId: habit.id,
                    habitData: preparedData,
                }).unwrap()
                onClose()
            }
        } catch (err: any) {
            setCustomError(err?.data?.message)
        }
    }

    const handleBlur = (field: 'goal' | 'goalDuration', min = 1) => {
        setFormData((prev) => ({
            ...prev,
            [field]: !prev[field] || prev[field] < min ? min : prev[field],
        }))
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl text-indigo-700 font-semibold mb-4">
                    New Habit
                </h2>

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
                            <label className="text-sm font-medium mb-1 block">
                                Category
                            </label>
                            <SelectField
                                placeholder="Select Category"
                                name="category"
                                value={formData.category}
                                handleOnChange={handleChange}
                                array={categories?.map((c) => c.name) || []}
                            />
                        </div>
                        <div className="col-span-3">
                            <label className="text-sm font-medium mb-1 block">
                                Icon
                            </label>
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
                            <label className="text-sm font-medium mb-1">
                                Goal
                            </label>
                            <InputNumber
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                onBlur={() => handleBlur('goal')}
                            />
                        </div>

                        <div className="col-span-4 flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Unit
                            </label>
                            <SelectField
                                name="unit"
                                value={formData.unit}
                                handleOnChange={handleChange}
                                array={unitOptions}
                            />
                        </div>

                        <div className="col-span-5 flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Periodicity
                            </label>
                            <SelectField
                                name="goalPeriodicity"
                                value={formData.goalPeriodicity}
                                handleOnChange={handleChange}
                                array={Object.values(GoalPeriodicity)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-3 flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Duration
                            </label>
                            <InputNumber
                                min={21}
                                name="goalDuration"
                                value={formData.goalDuration}
                                onChange={handleChange}
                                onBlur={() => handleBlur('goalDuration', 21)}
                            />
                        </div>

                        <div className="col-span-4 flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Repeat
                            </label>
                            <HabitScheduleDropdown
                                setFormData={setFormData}
                                habitSchedule={habit?.habitSchedule}
                            />
                        </div>

                        <div className="col-span-5 flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Start Date
                            </label>
                            <DatePicker
                                selected={formData.startDate}
                                onChange={(date: Date | null) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        startDate: date ?? new Date(),
                                    }))
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
                    <ErrorHandling customError={customError} />
                    {isLoading && (
                        <p className="text-sm text-center text-indigo-600">
                            Saving...
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default HabitForm
