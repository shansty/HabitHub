import React from 'react';
import HeroSection from './coponents/HeroSection';
import CTASection from './coponents/CTASection';
import HowItWorksSection from './coponents/HowItWorksSection';
import UsersStories from './coponents/UsersStories';

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
