'use client';

import StickyNavbar from '../../components/StickyNavbar';

export default function About() {
    return (
        <div className="min-h-screen bg-[#f2eee9] flex items-center justify-center relative">
            <StickyNavbar />
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[#1b3c44] mb-4 font-['Schibsted_Grotesk']">
                    About Us
                </h1>
                <p className="text-xl text-[#1b3c44] mb-8 font-['Lato']">
                    Learn more about TravelHosta and our mission
                </p>
                <p className="text-lg text-gray-600">
                    Coming soon...
                </p>
            </div>
        </div>
    );
}
