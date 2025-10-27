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
                width="w-[130px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[250px]"
                height="h-[48px] sm:h-[54px] md:h-[60px] lg:h-[70px] xl:h-[92px]"
                textSize="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[48px]"
                icon={<MenuIcon size={16} strokeWidth={2} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />}
                isRotated={isOpen}
            />
        </div>
    );
};

export default MenuButton;
