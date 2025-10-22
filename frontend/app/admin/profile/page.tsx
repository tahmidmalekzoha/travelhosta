'use client';

import { FunctionComponent } from 'react';
import ProfileEditor from '@/components/admin/ProfileEditor';

/**
 * Admin profile page for editing user profile
 */
const ProfilePage: FunctionComponent = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1b3c44]">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your profile information and display settings</p>
            </div>
            
            <ProfileEditor />
        </div>
    );
};

export default ProfilePage;
