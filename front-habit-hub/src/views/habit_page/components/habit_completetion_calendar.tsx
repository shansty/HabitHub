import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { isSameDay, startOfDay } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'
import { UsersHabitDetailedResponseData } from '../../../types'

interface HabitCompletionCalendarProps {
    habit: UsersHabitDetailedResponseData
}

const HabitCompletionCalendar: React.FC<HabitCompletionCalendarProps> = ({
    habit,
}) => {
    const [startDate, setStartDate] = useState(new Date())

    const isScheduled = (calendar_date: Date) =>
        habit.habitDailyData.some((d) =>
            isSameDay(new Date(d.date), calendar_date)
        )

    const isCompleted = (date: Date) =>
        habit.habitDailyData.some(
            (d) => isSameDay(new Date(d.date), date) && d.isGoalCompleted
        )

    const isFailed = (date: Date) => {
        const today = startOfDay(new Date())
        return habit.habitDailyData.some(
            (d) =>
                isSameDay(new Date(d.date), date) &&
                !d.isGoalCompleted &&
                new Date(d.date) < today
        )
    }

    const handleDayClick = (date: Date | null) => {
        if (!date) return
        setStartDate(date)
    }

    return (
        <div className="max-w-3xl p-4">
            <h2 className="mb-3 text-lg font-bold">📅 Habit Calendar</h2>
            <div>
                <DatePicker
                    inline
                    selected={startDate}
                    onChange={handleDayClick}
                    dayClassName={(calendar_date: Date) => {
                        if (isScheduled(calendar_date)) {
                            if (isCompleted(calendar_date)) {
                                return 'bg-green-400'
                            } else if (isFailed(calendar_date)) {
                                return 'bg-red-400'
                            } else {
                                return 'bg-purple-400'
                            }
                        }
                        return ''
                    }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-2">
                🟩 Completed | 🟥 Failed | 🟪 Scheduled | 🟦 Selected
            </p>
        </div>
    )
}

export default HabitCompletionCalendar
