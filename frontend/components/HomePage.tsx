'use client';

import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div className="w-full relative overflow-hidden flex flex-col items-center justify-start p-4 gap-24 text-left text-black min-h-screen"
            style={{ backgroundColor: '#f2eee9', fontFamily: 'Schibsted Grotesk, sans-serif' }}>

            {/* Hero Section */}
            <div className="self-stretch h-[690px] flex flex-col items-end justify-start p-8 relative gap-4"
                style={{
                    backgroundImage: 'url("/hero-placeholder.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px'
                }}>
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>

                {/* Sign In Button */}
                <div className="relative z-10 w-52 h-16 mb-3">
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#f2eee9' }}></div>
                    <div className="absolute top-3 left-7 text-black text-lg font-medium">
                        Sign In
                    </div>
                    <div className="absolute top-2 right-4 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#cd8453' }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Menu Button */}
                <div className="relative z-10 w-44 h-16">
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#f2eee9' }}></div>
                    <div className="absolute top-3 left-6 text-black text-lg font-medium">
                        Menu
                    </div>
                    <div className="absolute top-2 right-4 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#cd8453' }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                </div>

                {/* Logo positioned at bottom left of hero */}
                <div className="absolute bottom-8 left-8 z-10">
                    <h1 className="text-white text-4xl font-bold tracking-wide">
                        TRAVELHOSTA
                    </h1>
                    <p className="text-white/90 text-xl mt-2">
                        Sajek, Hill of Wonders
                    </p>
                </div>
            </div>

            {/* Description Section */}
            <div className="w-full max-w-6xl text-center">
                <p className="text-3xl md:text-4xl font-medium leading-relaxed"
                    style={{ color: '#1b3c44' }}>
                    At TravelHosta, we make exploring easy and affordable. Guides for every
                    traveler budget or premium. With tips on stay, food, and safety. Whether
                    you're chasing hidden gems or planning your next big escape, we've got
                    the roadmap ready for you.
                </p>
            </div>

            {/* Cards Section */}
            <div className="w-full max-w-7xl relative">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold" style={{ color: '#1b3c44' }}>
                        Find your next escape
                    </h2>

                    {/* See All Button */}
                    <div className="relative w-48 h-16">
                        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#1b3c44' }}></div>
                        <div className="absolute top-3 left-6 text-lg font-medium" style={{ color: '#f2eee9' }}>
                            See All
                        </div>
                        <div className="absolute top-2 right-4 w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#f2eee9' }}>
                            <svg className="w-6 h-6" style={{ color: '#1b3c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Travel Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1 */}
                    <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                        style={{
                            backgroundImage: 'url("/card-placeholder-1.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">Explore New Destinations That Cost Less Than Standard. Only $500/trip</h3>
                            <p className="text-sm mt-2 opacity-90">View</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                        style={{
                            backgroundImage: 'url("/card-placeholder-2.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">Explore New Destinations That Cost Less Than Standard. Only $500/trip</h3>
                            <p className="text-sm mt-2 opacity-90">View</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                        style={{
                            backgroundImage: 'url("/card-placeholder-3.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">Explore New Destinations That Cost Less Than Standard. Only $500/trip</h3>
                            <p className="text-sm mt-2 opacity-90">View</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                        style={{
                            backgroundImage: 'url("/card-placeholder-4.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">Explore New Destinations That Cost Less Than Standard. Only $500/trip</h3>
                            <p className="text-sm mt-2 opacity-90">View</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

const HomePage: React.FC = () => {
    return (
        <div className="w-full relative bg-background overflow-hidden flex flex-col items-center justify-start p-4 gap-24 text-left text-black font-schibsted min-h-screen">

            {/* Hero Section */}
            <div className="self-stretch h-[690px] flex flex-col items-end justify-start p-8 relative gap-4">
                {/* Hero Background Image */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <Image
                        src="/hero-image.jpg"
                        alt="Travel Hero"
                        fill
                        className="object-cover rounded-lg"
                        priority
                    />
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                </div>

                {/* Sign In Button */}
                <div className="relative z-10 w-52 h-16 mb-3">
                    <div className="absolute inset-0 rounded-full bg-background"></div>
                    <div className="absolute top-3 left-7 text-black text-lg font-medium">
                        Sign In
                    </div>
                    <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                        <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Menu Button */}
                <div className="relative z-10 w-44 h-16">
                    <div className="absolute inset-0 rounded-full bg-background"></div>
                    <div className="absolute top-3 left-6 text-black text-lg font-medium">
                        Menu
                    </div>
                    <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                        <Menu className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Logo positioned at bottom left of hero */}
                <div className="absolute bottom-8 left-8 z-10">
                    <h1 className="text-white text-4xl font-bold tracking-wide">
                        TRAVELHOSTA
                    </h1>
                    <p className="text-white/90 text-xl mt-2">
                        Sajek, Hill of Wonders
                    </p>
                </div>
            </div>

            {/* Description Section */}
            <div className="w-full max-w-6xl text-center">
                <p className="text-3xl md:text-4xl font-medium text-dark leading-relaxed">
                    At TravelHosta, we make exploring easy and affordable. Guides for every
                    traveler budget or premium. With tips on stay, food, and safety. Whether
                    you're chasing hidden gems or planning your next big escape, we've got
                    the roadmap ready for you.
                </p>
            </div>

            {/* Cards Section */}
            <div className="w-full max-w-7xl relative">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold text-dark">
                        Find your next escape
                    </h2>

                    {/* See All Button */}
                    <div className="relative w-48 h-16">
                        <div className="absolute inset-0 rounded-full bg-dark"></div>
                        <div className="absolute top-3 left-6 text-background text-lg font-medium">
                            See All
                        </div>
                        <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-background flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-dark" />
                        </div>
                    </div>
                </div>

                {/* Travel Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1 */}
                    <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                            src="/card1.jpg"
                            alt="Travel Destination 1"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">Explore New Destinations That Cost Less Than Standard. Only $500/trip</h3>
                            <p className="text-sm mt-2 opacity-90">View</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                            src="/card2.jpg"
                            alt="Travel Destination 2"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">Explore New Destinations That Cost Less Than Standard. Only $500/trip</h3>
                            <p className="text-sm mt-2 opacity-90">View</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                            src="/card3.jpg"
                            alt="Travel Destination 3"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">Explore New Destinations That Cost Less Than Standard. Only $500/trip</h3>
                            <p className="text-sm mt-2 opacity-90">View</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                            src="/card4.jpg"
                            alt="Travel Destination 4"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">Explore New Destinations That Cost Less Than Standard. Only $500/trip</h3>
                            <p className="text-sm mt-2 opacity-90">View</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
