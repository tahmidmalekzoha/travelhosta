"use client";

import { FunctionComponent } from 'react';
import AnimatedButton from './shared/AnimatedButton';

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
            width="w-[250px]"
            height="h-[92px]"
            textSize="text-[48px]"
            iconSrc="/images/Vector.svg"
            iconAlt="Menu"
            isRotated={isOpen}
        />
    );
};

export default MenuButton;
