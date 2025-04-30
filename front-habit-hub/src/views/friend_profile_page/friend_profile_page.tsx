import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, isToday, isTomorrow } from 'date-fns'
import { useLazyGetFriendUserHabitsByDateQuery } from '../../services/habit'
import 'react-datepicker/dist/react-datepicker.css'
import { useClickOutside } from '../../hooks'
import { Keyboard } from 'lucide-react'
import FriendUserData from './components/friend_user_data'
import FriendHabitList from './components/friend_habit_list'
import { useParams } from 'react-router-dom'

const FriendProfilePage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [showCalendar, setShowCalendar] = useState(false)
    const [getHabits, { data}] = useLazyGetFriendUserHabitsByDateQuery()
    const {friendId} = useParams();

    const calendarRef = useRef<HTMLDivElement>(null)
    useClickOutside(calendarRef, () => setShowCalendar(false))
    let formattedDate: string


    useEffect(() => {
        formattedDate = format(selectedDate, 'yyyy-MM-dd')
        getHabits({friendId: friendId as string, date: formattedDate})
    }, [selectedDate])
    console.dir({data})


    const getDateLabel = () => {
        if (isToday(selectedDate)) return 'Today'
        if (isTomorrow(selectedDate)) return 'Tomorrow'
        return format(selectedDate, 'yyyy-MM-dd')
    }

    return (
        <div className="min-h-screen bg-blue-800 flex center justify-center">
            <div
                className="w-full max-w-350 bg-white rounded-xl p-8 space-y-3 mt-20 mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <FriendUserData />

                    <div
                        className="relative flex sm:flex-row items-start sm:items-center gap-2"
                        ref={calendarRef}
                    >
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="text-indigo-700 font-medium border px-3 py-2 rounded-md w-full min-w-auto text-nowrap flex items-center gap-2"
                        >
                            <Keyboard />
                            {getDateLabel()}
                        </button>


                        {showCalendar && (
                            <div className="absolute  top-full right-0 z-10 shadow-lg bg-white p-2 rounded">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date | null) => {
                                        if (date) {
                                            setSelectedDate(date)
                                            setShowCalendar(false)
                                        }
                                    }}
                                    inline
                                />
                            </div>
                        )}
                    </div>
                </div>
                <FriendHabitList friend_habits={data} />
            </div>
        </div>
    )
}

export default FriendProfilePage
