import React from 'react'
import HeroSection from '../home_page/coponents/hero_section'
import CTASection from '../home_page/coponents/cta_section'
import HowItWorksSection from '../home_page/coponents/how_it_works_section'
import UsersStories from '../home_page/coponents/users_stories'

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
