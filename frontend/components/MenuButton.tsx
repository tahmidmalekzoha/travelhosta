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
            width="w-[250px]"
            height="h-[92px]"
            textSize="text-[48px]"
            icon={<MenuIcon size={28} strokeWidth={2} />}
            isRotated={isOpen}
        />
    );
};

export default MenuButton;
