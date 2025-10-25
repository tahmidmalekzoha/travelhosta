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
        <AnimatedButton
            text="Menu"
            onClick={onClick}
            width="w-[180px] md:w-[200px] lg:w-[250px]"
            height="h-[60px] md:h-[76px] lg:h-[92px]"
            textSize="text-[28px] md:text-[38px] lg:text-[48px]"
            icon={<MenuIcon size={20} strokeWidth={2} className="md:w-7 md:h-7" />}
            isRotated={isOpen}
        />
    );
};

export default MenuButton;
