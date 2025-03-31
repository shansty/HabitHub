import React from 'react';

const CTASection: React.FC = () => {
    return (
        <section className="text-center py-16 bg-indigo-700 text-white">
            <h2 className="text-3xl font-semibold mb-4">Start your journey today!</h2>
            <button className="cursor-pointer mt-3 mr-2 px-8 py-3 bg-white text-indigo-700 font-bold rounded-full text-lg shadow hover:bg-gray-100 transition">Log In</button>
            <button className="cursor-pointer mt-3 ml-2 px-8 py-3 bg-white text-indigo-700 font-bold rounded-full text-lg shadow hover:bg-gray-100 transition">Sign Up</button>
        </section>
    );
}

export default CTASection;
