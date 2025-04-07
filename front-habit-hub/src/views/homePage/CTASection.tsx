import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
    const navigate = useNavigate();

    const navigateToLogIn = (): void => {
        navigate('/login')
    }
    
    const navigateToSignUp = (): void => {
        navigate('/sign_up')
    }

    return (
        <section className="sticky top-0 text-center py-12 bg-indigo-700 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4">Start your journey today!</h2>
            <button onClick={navigateToLogIn} className="cursor-pointer mt-3 mr-2 px-8 py-3 bg-white text-indigo-700 font-bold rounded-4xl text-sm sm:text-base md:text-lg shadow hover:bg-gray-100 transition">Log In</button>
            <button onClick={navigateToSignUp} className="cursor-pointer mt-3 ml-2 px-8 py-3 bg-white text-indigo-700 font-bold rounded-4xl text-sm sm:text-base md:text-lg  shadow hover:bg-gray-100 transition">Sign Up</button>
        </section>
    );
}

export default CTASection;
