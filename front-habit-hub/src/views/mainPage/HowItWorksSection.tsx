import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-blue-100 flex items-center justify-center">
      <div className="max-w-2xl text-center bg-white p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="text-left space-y-2 text-lg">
          <p>1️⃣ <strong>Set Your Habits</strong> – Define your daily, weekly, or custom goals.</p>
          <p>2️⃣ <strong>Track Your Progress</strong> – Mark your habits as completed and watch your streaks grow.</p>
          <p>3️⃣ <strong>Stay Accountable</strong> – Share updates with friends and celebrate milestones.</p>
        </div>
        <p className="mt-8 text-xl">
          Ready to create lasting habits?{' '}
          <a href="#" className="text-indigo-700 font-semibold">
            Join HabitHub now! 🚀
          </a>
        </p>
      </div>
    </section>
  );
};

export default HowItWorksSection;

