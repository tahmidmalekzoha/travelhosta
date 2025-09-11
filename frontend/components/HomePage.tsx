import HeroSection from './HeroSection';

export default function HomePage() {
    return (
        <div
            className="w-full relative overflow-hidden flex flex-col items-center justify-start p-4 gap-24 text-left text-black min-h-screen"
            style={{ backgroundColor: '#f2eee9', fontFamily: 'Schibsted Grotesk, sans-serif' }}
        >

            {/* Hero Section */}
            <HeroSection />

            {/* Logo positioned at bottom left of hero - now separate overlay */}
            <div className="absolute top-[550px] left-12 z-10">
                <h1 className="text-white text-4xl font-bold tracking-wide drop-shadow-lg">
                    TRAVELHOSTA
                </h1>
                <p className="text-white/90 text-xl mt-2 drop-shadow-md">
                    Sajek, Hill of Wonders
                </p>
            </div>

            {/* Description Section */}
            <div className="w-full max-w-6xl text-center">
                <p
                    className="text-3xl md:text-4xl font-medium leading-relaxed"
                    style={{ color: '#1b3c44' }}
                >
                    At TravelHosta, we make exploring easy and affordable. Guides for every
                    traveler budget or premium. With tips on stay, food, and safety. Whether
                    you're chasing hidden gems or planning your next big escape, we've got
                    the roadmap ready for you.
                </p>
            </div>

            {/* Cards Section */}
            <div className="w-full max-w-7xl relative">
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold"
                        style={{ color: '#1b3c44' }}
                    >
                        Find your next escape
                    </h2>

                    {/* See All Button */}
                    <div className="relative w-48 h-16 flex-shrink-0">
                        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#1b3c44' }}></div>
                        <div
                            className="absolute top-3 left-6 text-lg font-medium"
                            style={{ color: '#f2eee9' }}
                        >
                            See All
                        </div>
                        <div
                            className="absolute top-2 right-4 w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#f2eee9' }}
                        >
                            <svg
                                className="w-6 h-6"
                                style={{ color: '#1b3c44' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Travel Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1 */}
                    <div
                        className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                        style={{
                            backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-lg font-semibold mb-2">
                                Explore New Destinations That Cost Less Than Standard. Only $500/trip
                            </h3>
                            <p className="text-sm opacity-90">View →</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div
                        className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                        style={{
                            backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-lg font-semibold mb-2">
                                Explore New Destinations That Cost Less Than Standard. Only $500/trip
                            </h3>
                            <p className="text-sm opacity-90">View →</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div
                        className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                        style={{
                            backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-lg font-semibold mb-2">
                                Explore New Destinations That Cost Less Than Standard. Only $500/trip
                            </h3>
                            <p className="text-sm opacity-90">View →</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div
                        className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                        style={{
                            backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-lg font-semibold mb-2">
                                Explore New Destinations That Cost Less Than Standard. Only $500/trip
                            </h3>
                            <p className="text-sm opacity-90">View →</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
