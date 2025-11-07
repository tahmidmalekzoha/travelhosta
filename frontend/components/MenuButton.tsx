"use client";

import { FunctionComponent } from 'react';
import AnimatedButton from './shared/AnimatedButton';
import { Menu as MenuIcon } from 'lucide-react';

interface MenuButtonProps {
    onClick?: () => void;
    isOpen?: boolean;
}

/**
 * Animated menu button with toggle state and hover effects
 * Features sliding text animation, rotation effects, and state management
 */
const MenuButton: FunctionComponent<MenuButtonProps> = ({ onClick, isOpen = false }) => {
    return (
        <div className="flex justify-end">
            <AnimatedButton
                text="Menu"
                onClick={onClick}
                width="w-[110px] sm:w-[130px] md:w-[150px] lg:w-[170px]"
                height="h-[40px] sm:h-[44px] md:h-[48px] lg:h-[56px]"
                textSize="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px]"
                icon={<MenuIcon className="w-[30%] h-[30%]" strokeWidth={2} />}
                isRotated={isOpen}
            />
        </div>
    );
};

export default MenuButton;
