import React from 'react'

const UsersStories: React.FC = () => {
    const people = [
        {
            name: 'Sarah',
            age: 29,
            role: 'Freelancer',
            story: 'I used HabitHub to build a morning routine that helped me boost productivity as a freelancer. I now wake up at 6AM, meditate daily, and plan my day — all thanks to consistent tracking!',
        },
        {
            name: 'James',
            age: 34,
            role: 'Fitness Enthusiast',
            story: 'HabitHub helped me stick to my workout goals. I haven’t missed a gym day in 3 months. The streaks feature really kept me motivated!',
        },
        {
            name: 'Aisha',
            age: 25,
            role: 'University Student',
            story: 'I used HabitHub to stay on top of my study habits. It helped me prep consistently for exams, finish my thesis early, and reduce burnout.',
        },
    ]
    return (
        <section className="bg-blue-100 py-12 px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 ">
                Stories Of Our Users
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {people.map((person, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 shadow-md text-left"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            {person.name}, {person.age}
                        </h3>
                        <p className="text-indigo-500 font-medium mb-4">
                            {person.role}
                        </p>
                        <p className="text-gray-700">{person.story}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default UsersStories
