import React from 'react'
import { Link } from 'react-router-dom'

const HowItWorksSection: React.FC = () => {
    return (
        <section className="py-16 px-6 bg-blue-100 flex items-center justify-center">
            <div className="max-w-2xl text-center bg-white p-8 shadow-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                    How It Works
                </h2>
                <div className="text-left space-y-2 text-base sm:text-lg md:text-xl">
                    <p>
                        1️⃣ <strong>Set Your Habits</strong> – Define your daily,
                        weekly, or custom goals.
                    </p>
                    <p>
                        2️⃣ <strong>Track Your Progress</strong> – Mark your
                        habits as completed and watch your streaks grow.
                    </p>
                    <p>
                        3️⃣ <strong>Stay Accountable</strong> – Share updates
                        with friends and celebrate milestones.
                    </p>
                </div>
                <p className="mt-8 text-xl">
                    Ready to create lasting habits?{' '}
                    <Link to="/login" className="text-indigo-700 font-semibold">
                        {' '}
                        Join HabitHub now! 🚀
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default HowItWorksSection
