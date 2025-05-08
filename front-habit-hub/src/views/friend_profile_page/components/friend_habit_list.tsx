import React from 'react'
import { UsersHabitPreviewResponseData } from '../../../types'
import FriendHabit from './friend_habit_item'

interface FriendHabitListProps {
    friend_habits: UsersHabitPreviewResponseData[] | undefined
}

const FriendHabitList: React.FC<FriendHabitListProps> = ({ friend_habits }) => {
    const sortedHabits = friend_habits?.slice().sort((a, b) => {
        return Number(a.isGoalCompleted) - Number(b.isGoalCompleted)
    })

    return (
        <div className="space-y-5">
            {sortedHabits && sortedHabits.length > 0 ? (
                sortedHabits.map((friend_habit) => (
                    <FriendHabit
                        habit={friend_habit}
                        key={friend_habit.id}
                    />
                ))
            ) : (
                <p className="text-center text-gray-400 mt-8 text-sm">
                    Your friend don’t have any habits for this date.
                </p>
            )}
        </div>
    )
}

export default FriendHabitList
