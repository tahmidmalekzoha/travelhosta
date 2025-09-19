import { FunctionComponent, useEffect } from 'react';

const HeroSection: FunctionComponent = () => {

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe all elements with scroll animation classes
        const animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-up, .scroll-slide-left, .scroll-slide-right');
        animatedElements.forEach((el) => observer.observe(el));

        return () => {
            animatedElements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <div className="w-full relative h-full rounded-[47px] overflow-hidden shadow-2xl scroll-fade-in">
            {/* Hero Background Image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center scroll-slide-up"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url("/images/hero-background.jpg")`,
                }}
            />

            {/* TRAVELHOSTA Logo */}
            <div className="absolute top-6 md:top-8 lg:top-12 left-4 md:left-8 lg:left-12 z-10 scroll-slide-left">
                <img
                    src="/images/logo.svg"
                    alt="TRAVELHOSTA"
                    className="w-[300px] md:w-[500px] lg:w-[600px] xl:w-[730px] h-[60px] md:h-[90px] lg:h-[110px] xl:h-[130px] drop-shadow-lg"
                />
            </div>

            {/* Subtitle */}
            <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 left-4 md:left-8 lg:left-12 z-10 scroll-slide-up">
                <h2 className="text-white text-2xl md:text-4xl lg:text-5xl xl:text-[64px] font-normal tracking-wide drop-shadow-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Sajek, Hill of Wonders
                </h2>
            </div>
        </div>
    );
};

export default HeroSection;
