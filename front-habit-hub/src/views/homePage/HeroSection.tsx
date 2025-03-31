import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="relative bg-cover bg-blue-100 h-[70vh] flex items-center justify-center px-6" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?productivity,habit')" }}>
            <div className="bg-white p-8 max-w-2xl text-center shadow-lg">
                <h1 className="text-4xl font-bold mb-4">Welcome to HabitHub – Your Personal Habit Tracker</h1>
                <p className="text-xl mb-6">Build Better Habits. Achieve More.</p>
                <div className="text-left space-y-2 text-lg">
                    <p>✅ Set & track habits effortlessly</p>
                    <p>✅ Stay motivated with streaks & reminders</p>
                    <p>✅ Connect with friends and celebrate progress</p>
                </div>
                <p className="mt-6">Take control of your daily routines and reach your goals with ease. HabitHub helps you track your habits, stay consistent, and share progress with friends for motivation.</p>
            </div>
        </section>
    );
}

export default HeroSection;
