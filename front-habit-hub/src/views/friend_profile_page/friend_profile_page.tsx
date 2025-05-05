import React, { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { useLazyGetFriendUserHabitsByDateQuery } from '../../services/habit'
import 'react-datepicker/dist/react-datepicker.css'
import FriendUserData from './components/friend_user_data'
import FriendHabitList from './components/friend_habit_list'
import { useNavigate, useParams } from 'react-router-dom'

const FriendProfilePage: React.FC = () => {
    const [getHabits, { data }] = useLazyGetFriendUserHabitsByDateQuery()
    const { friendId } = useParams();
    const navigate  = useNavigate();
    let formattedDate: string


    useEffect(() => {
        formattedDate = format(new Date, 'yyyy-MM-dd')
        getHabits({ friendId: friendId as string, date: formattedDate })
    }, [])

 
    return (
        <div className="min-h-screen bg-blue-800 flex center justify-center">
            <div
                className="w-full max-w-350 bg-white rounded-xl p-8 space-y-3 mt-20 mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                    onClick={() => navigate('/profile')}
                    className="text-md text-white bg-indigo-600 rounded-md py-1 px-2 mb-5 cursor-pointer"
                >
                    ←
                </button>
                    <FriendUserData />
                </div>
                <FriendHabitList friend_habits={data} />
            </div>
        </div>
    )
}

export default FriendProfilePage
