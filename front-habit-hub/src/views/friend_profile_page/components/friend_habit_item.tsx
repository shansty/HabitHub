import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UsersHabitPreviewResponseData } from '../../../types'
import { CheckCheck } from 'lucide-react'
import { formatString } from '../../../utils'

interface FriendHabitProps {
    habit: UsersHabitPreviewResponseData
}

const FriendHabit: React.FC<FriendHabitProps> = ({ habit }) => {
    const navigate = useNavigate()
    const { friendId } = useParams();

    const goToFriendHabitPage = () => {
        navigate(`/friend/${friendId}/habits/${habit.id}`)
    }

    return (
        <div className="space-y-5 mt-10">
            <div
                key={habit.id}
                className="flex items-center justify-between rounded-xl px-5 py-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
                <div className="flex items-center space-x-4">
                    <div
                        className="text-4xl cursor-pointer"
                        onClick={goToFriendHabitPage}
                    >
                        {habit.icon}
                    </div>

                    <div>
                        <h3
                            className="text-lg font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
                            onClick={goToFriendHabitPage}
                        >
                            {habit.name}
                            {habit.isGoalCompleted && (
                                <CheckCheck className="text-lime-500" />
                            )}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Progress:{' '}
                            <span
                                className={`font-medium ${habit.isGoalCompleted ? 'text-lime-500' : ''}`}
                            >
                                {habit.value}
                            </span>{' '}
                            / {habit.goal} {formatString(habit.unit)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendHabit
