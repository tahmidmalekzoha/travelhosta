"use client";

import { FunctionComponent } from 'react';
import SigninButton from './SigninButton';
import MenuButton from './MenuButton';

const StickyNavbar: FunctionComponent = () => {
    return (
        <div className="fixed top-4 md:top-6 lg:top-8 right-4 md:right-6 lg:right-8 z-50 flex flex-col gap-2 md:gap-3 items-end">
            <SigninButton />
            <MenuButton />
        </div>
    );
};

export default StickyNavbar;