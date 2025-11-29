'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

interface ProfileEditorProps {
    onClose?: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
    const { user, profile, refreshProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [displayName, setDisplayName] = useState(profile?.display_name || '');
    const [username, setUsername] = useState(profile?.username || '');
    const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth || '');

    // Cooldown info
    const [nextNameChangeAt, setNextNameChangeAt] = useState<string | null>(null);
    const [canChangeName, setCanChangeName] = useState(true);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || '');
            setUsername(profile.username || '');
            setDateOfBirth(profile.date_of_birth || '');

            // Calculate if user can change display name
            if (profile.last_name_change_at) {
                const lastChange = new Date(profile.last_name_change_at);
                const nextChange = new Date(lastChange.getTime() + 24 * 60 * 60 * 1000); // 24 hours
                const now = new Date();

                if (now < nextChange) {
                    setCanChangeName(false);
                    setNextNameChangeAt(nextChange.toISOString());
                } else {
                    setCanChangeName(true);
                    setNextNameChangeAt(null);
                }
            }
        }
    }, [profile]);

    const handleUpdateDisplayName = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await authService.updateDisplayName(displayName);

            if (response.success) {
                setSuccess('Display name updated successfully!');
                if (refreshProfile) {
                    await refreshProfile();
                }
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.error || 'Failed to update display name');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await authService.setUsername(username);

            if (response.success) {
                setSuccess('Username set successfully!');
                if (refreshProfile) {
                    await refreshProfile();
                }
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.error || 'Failed to set username');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            if (!user?.id) {
                setError('User not authenticated');
                return;
            }

            const response = await authService.updateUserProfile(user.id, {
                username: username || '',
                date_of_birth: dateOfBirth || null,
            });

            if (response.success) {
                setSuccess('Profile updated successfully!');
                if (refreshProfile) {
                    await refreshProfile();
                }
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!profile) {
        return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Profile
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 rounded">
                    {success}
                </div>
            )}

            {/* Current Profile Info */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Current Profile</h3>
                <div className="space-y-1 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Email:</span> {profile.email}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Username:</span> @{profile.username || 'Not set'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Display Name:</span> {profile.display_name || 'Not set'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Role:</span> 
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            {profile.role}
                        </span>
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Display Name Form */}
                <form onSubmit={handleUpdateDisplayName} className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Display Name
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Your display name is shown on guides you create or edit. You can change it once every 24 hours.
                    </p>
                    
                    {!canChangeName && nextNameChangeAt && (
                        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-800 dark:text-yellow-400 rounded text-sm">
                            You can change your display name again at {new Date(nextNameChangeAt).toLocaleString()}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter display name"
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            minLength={2}
                            maxLength={50}
                            required
                            disabled={!canChangeName || isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!canChangeName || isLoading || displayName === profile.display_name}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>

                {/* Username Form */}
                <form onSubmit={handleSetUsername} className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Username
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Your username is a unique permanent identifier (like @{username || 'username'}). 
                        {profile.username ? ' Only admins can change it once set.' : ' You can set it once.'}
                    </p>

                    <div className="flex gap-3">
                        <div className="flex-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden dark:bg-gray-700">
                            <span className="px-3 text-gray-500 dark:text-gray-400">@</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                                placeholder="username"
                                className="flex-1 px-2 py-2 border-0 focus:ring-0 dark:bg-gray-700 dark:text-white"
                                minLength={3}
                                maxLength={30}
                                pattern="[a-z0-9_\-]+"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || username === profile.username || !username}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            {isLoading ? 'Setting...' : profile.username ? 'Change' : 'Set'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Only letters, numbers, underscores, and hyphens allowed
                    </p>
                </form>

                {/* Other Profile Info */}
                <form onSubmit={handleUpdateProfile}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Profile Information
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                        >
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditor;
