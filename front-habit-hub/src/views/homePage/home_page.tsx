import React from 'react'
import HeroSection from './coponents/hero_section'
import CTASection from './coponents/cta_section'
import HowItWorksSection from './coponents/how_it_works_section'
import UsersStories from './coponents/users_stories'

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            <HeroSection />
            <CTASection />
            <HowItWorksSection />
            <UsersStories />
        </div>
    )
}

export default HomePage
