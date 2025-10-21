"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, type UserProfile } from '../services/authService';
import { sessionCache } from '../utils/sessionCache';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    isLoading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Derived state: check if user is admin
    const isAdmin = profile?.role === 'admin';

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                console.log('🔐 Initializing authentication...');
                
                // Step 0: Check if session is expired
                if (sessionCache.isSessionExpired()) {
                    console.log('⏰ Session expired - clearing auth state');
                    await authService.signOut();
                    setUser(null);
                    setProfile(null);
                    setSession(null);
                    setIsLoading(false);
                    return;
                }

                // Step 1: Try to get cached profile (avoid API call)
                const cachedProfile = sessionCache.getCachedProfile();
                
                if (cachedProfile) {
                    console.log('📦 Loading auth from cache:', cachedProfile.email);
                    
                    // Get session (this is from localStorage, not an API call)
                    const currentSession = await authService.getCurrentSession();
                    
                    if (currentSession?.user) {
                        // Use cached data - no API call needed!
                        setSession(currentSession);
                        setUser(currentSession.user);
                        setProfile(cachedProfile);
                        setIsLoading(false);
                        return;
                    }
                }
                
                // Step 2: No cache or cache invalid - validate with Supabase
                console.log('🔍 No valid cache - validating with Supabase...');
                const currentSession = await authService.getCurrentSession();
                
                if (currentSession?.user) {
                    console.log('📝 Session found in cookies for user:', currentSession.user.email);
                    
                    // Step 3: Fetch user profile from database (API call)
                    let userProfile = await authService.getUserProfile(currentSession.user.id);
                    
                    // Retry once if profile is null (handle race conditions)
                    if (!userProfile) {
                        console.warn('⚠️ Profile not found on first attempt, retrying...');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        userProfile = await authService.getUserProfile(currentSession.user.id);
                    }
                    
                    // Step 4: Validate profile exists and has valid role
                    if (!userProfile) {
                        console.error('❌ User profile not found in database. Logging out...');
                        await authService.signOut();
                        sessionCache.clearSessionCache();
                        setUser(null);
                        setProfile(null);
                        setSession(null);
                    } else if (!userProfile.role || (userProfile.role !== 'user' && userProfile.role !== 'admin')) {
                        console.error('❌ Invalid user role. Logging out...');
                        await authService.signOut();
                        sessionCache.clearSessionCache();
                        setUser(null);
                        setProfile(null);
                        setSession(null);
                    } else {
                        // Step 5: All checks passed - cache the profile and update state
                        console.log(`✅ Authentication validated: ${userProfile.email} (${userProfile.role})`);
                        sessionCache.saveSessionCache(userProfile);
                        setSession(currentSession);
                        setUser(currentSession.user);
                        setProfile(userProfile);
                    }
                } else {
                    console.log('ℹ️ No active session found');
                    sessionCache.clearSessionCache();
                }
            } catch (error) {
                console.error('❌ Error initializing auth:', error);
                // Clear everything on error
                sessionCache.clearSessionCache();
                setUser(null);
                setProfile(null);
                setSession(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen to auth state changes
        const { data: { subscription } } = authService.onAuthStateChange(async (event, newSession) => {
            console.log('🔄 Auth state changed:', event);
            
            if (newSession?.user) {
                console.log('📝 New session detected for user:', newSession.user.email);
                
                // Step 1: Fetch user profile from database
                let userProfile = await authService.getUserProfile(newSession.user.id);
                
                // Retry once if profile is null (handle race conditions)
                if (!userProfile) {
                    console.warn('⚠️ Profile not found on first attempt, retrying...');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    userProfile = await authService.getUserProfile(newSession.user.id);
                }
                
                // Step 2: Validate profile exists and has valid role
                if (!userProfile) {
                    console.error('❌ User profile not found in database. Logging out...');
                    await authService.signOut();
                    sessionCache.clearSessionCache();
                    setUser(null);
                    setProfile(null);
                    setSession(null);
                } else if (!userProfile.role || (userProfile.role !== 'user' && userProfile.role !== 'admin')) {
                    console.error('❌ Invalid user role. Logging out...');
                    await authService.signOut();
                    sessionCache.clearSessionCache();
                    setUser(null);
                    setProfile(null);
                    setSession(null);
                } else {
                    // Step 3: All checks passed - cache profile and update state
                    console.log(`✅ Session validated: ${userProfile.email} (${userProfile.role})`);
                    sessionCache.saveSessionCache(userProfile);
                    setSession(newSession);
                    setUser(newSession.user);
                    setProfile(userProfile);
                }
            } else {
                console.log('ℹ️ Session ended - logging out');
                sessionCache.clearSessionCache();
                setSession(null);
                setUser(null);
                setProfile(null);
            }

            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Sign out handler
    const handleSignOut = async () => {
        try {
            await authService.signOut();
            sessionCache.clearSessionCache();
            setUser(null);
            setProfile(null);
            setSession(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Refresh profile data
    const refreshProfile = async () => {
        if (user) {
            try {
                const userProfile = await authService.getUserProfile(user.id);
                setProfile(userProfile);
            } catch (error) {
                console.error('Error refreshing profile:', error);
            }
        }
    };

    const value: AuthContextType = {
        user,
        profile,
        session,
        isLoading,
        isAdmin,
        signOut: handleSignOut,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
