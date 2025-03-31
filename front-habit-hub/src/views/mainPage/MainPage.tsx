import React from 'react';
import HeroSection from './HeroSection';
import CTASection from './CTASection';
import HowItWorksSection from './HowItWorksSection';

const MainPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            <HeroSection />
            <CTASection />
            <HowItWorksSection />
        </div>
    );
}

export default MainPage;
