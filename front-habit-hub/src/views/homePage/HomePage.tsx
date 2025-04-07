import React from 'react';
import HeroSection from './HeroSection';
import CTASection from './CTASection';
import HowItWorksSection from './HowItWorksSection';
import UsersStories from './UsersStories';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            <HeroSection />
            <CTASection />
            <HowItWorksSection />
            <UsersStories />
        </div>
    );
}

export default HomePage;
