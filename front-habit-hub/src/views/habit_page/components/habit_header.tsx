import React from 'react'
import { useParams } from 'react-router-dom'
import { UsersHabitDetailedResponseData } from '../../../types'
import { formatString } from '../../../utils'
import { HabitStatus } from '../../../enums'
import { useStartNewHabitAttemptMutation } from '../../../services/habit'

interface HabitHeaderProps {
    habit: UsersHabitDetailedResponseData
}

const HabitHeader: React.FC<HabitHeaderProps> = ({ habit }) => {
    const [startNewHabitAttempt] = useStartNewHabitAttemptMutation()
    const { id } = useParams<{ id: string }>()

    const handleStartAgain = async () => {
        if (!id) return
        await startNewHabitAttempt({
            date: new Date(),
            habitId: id,
        }).unwrap()
    }
    return (
        <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-4">
                <div className="text-5xl">{habit.icon}</div>
                <div>
                    <h1 className="text-2xl font-bold ">{habit.name}</h1>
                    <p className="text-sm text-gray-500">
                        {habit.goal} {formatString(habit.unit)}{' '}
                        {habit.goalPeriodicity?.toLowerCase().replace('_', ' ')}
                    </p>
                </div>
            </div>
            {habit.status == HabitStatus.ABANDONED && (
                <button
                    onClick={handleStartAgain}
                    className="mr-20 text-lg bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer"
                >
                    Start again
                </button>
            )}
        </div>
    )
}

export default HabitHeader
