import { FunctionComponent } from 'react';

const HeroSection: FunctionComponent = () => {
    return (
        <div className="w-full relative h-[690px] flex flex-col items-end justify-start p-[34px] box-border gap-[13px] text-left text-[32px] text-black font-['Schibsted_Grotesk']">
            {/* Hero Background Image */}
            <img
                className="w-[1404px] absolute top-0 left-0 h-[690px] z-0"
                alt="Hero background"
                src="/images/Hero.svg"
            />

            {/* Sign In Button Group */}
            <div className="w-[213px] relative h-[68px] z-[1]">
                {/* Background */}
                <div className="absolute top-0 left-0 rounded-[45px] bg-[#f2eee9] w-[213px] h-[68px]" />

                {/* Sign In Text */}
                <div className="absolute top-[12px] left-[30px] inline-block w-[108px]">
                    Sign In
                </div>

                {/* Orange Circle */}
                <div className="absolute top-[9px] left-[153px] rounded-[50%] bg-[#cd8453] w-[49px] h-[49px]" />

                {/* Arrow Icon */}
                <img
                    className="absolute h-[33.82%] w-[10.8%] top-[33.82%] right-[11.27%] bottom-[32.35%] left-[77.93%] max-w-full overflow-hidden max-h-full"
                    alt="Arrow"
                    src="/images/Arrow.svg"
                />
            </div>

            {/* Menu Button Group */}
            <div className="w-[180px] relative h-[68px] z-[2]">
                {/* Background */}
                <div className="absolute top-0 left-0 rounded-[45px] bg-[#f2eee9] w-[180px] h-[68px]" />

                {/* Orange Circle */}
                <div className="absolute top-[9px] left-[120px] rounded-[50%] bg-[#cd8453] w-[49px] h-[49px]" />

                {/* Menu Icon */}
                <img
                    className="absolute top-[26px] left-[132px] w-[26px] h-[16px]"
                    alt="Menu"
                    src="/images/Vector.svg"
                />

                {/* Menu Text */}
                <div className="absolute top-[12px] left-[26px]">
                    Menu
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
