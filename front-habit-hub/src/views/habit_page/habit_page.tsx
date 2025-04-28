import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from '../../common_components/modal_notification'
import { getToken, isTokenValid } from '../../utils'
import HabitDetail from '../habit_page/components/habit_detail'
import { useGetHabitByIdQuery } from '../../services/habit'
import HabitCompletionCalendar from '../habit_page/components/habit_completetion_calendar'
import HabitProgressWidget from '../habit_page/components/progress_widget'
import HabitHeader from '../habit_page/components/habit_header'
import HabitAnalyticsChart from '../habit_page/components/analytics_chart'

const HabitPage: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const token = getToken()
    const isValid = isTokenValid(token)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        data: habit,
        isLoading,
        isError,
    } = useGetHabitByIdQuery(id as string, { refetchOnMountOrArgChange: true })

    useEffect(() => {
        if (!token || !isValid) {
            setIsModalOpen(true)
        }
    }, [token, isValid])

    const handleOnModalClose = () => {
        setIsModalOpen(false)
        navigate('/login')
    }

    if (isLoading)
        return <p className="text-center text-white mt-20">Loading habit...</p>
    if (isError || !habit)
        return <p className="text-center text-white mt-20">Habit not found.</p>

    return (
        <div className="min-h-screen bg-blue-800 flex items-center justify-center px-4">
            <div className="w-full max-w-350 bg-white rounded-xl p-8 space-y-3 mt-20 mb-20">
                {(!token || !isValid) && isModalOpen && (
                    <Modal
                        onClose={handleOnModalClose}
                        isOpen={true}
                        title="Your session has expired"
                        message="You need to log in to access the data"
                    />
                )}
                <div>
                    <HabitHeader habit={habit} />
                </div>
                <div className="grid space-y-5">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-2/4">
                            <HabitDetail habit={habit} />
                        </div>
                        <div className="w-full md:w-2/4">
                            <HabitProgressWidget habit={habit} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-2/4 md:order-1">
                            <HabitCompletionCalendar habit={habit} />
                        </div>
                        <div className="w-full md:w-2/4 md:order-2">
                            <HabitAnalyticsChart data={habit.habitDailyData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HabitPage
