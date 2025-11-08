"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService, type UserProfile, type UserRole } from '@/services/authService';
import { isAdminRole, isSuperAdminRole } from '@/services/authPolicies';
import { logger } from '../utils/logger';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    isLoading: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCEPTED_ROLES: UserRole[] = ['user', 'admin', 'superadmin'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const applyUnauthenticatedState = (reason?: string) => {
            if (reason) {
                logger.info('AuthProvider.session.inactive', { reason });
            }
            setUser(null);
            setProfile(null);
            setSession(null);
        };

        const hydrateFromSession = async () => {
            try {
                setIsLoading(true);
                const result = await authService.validateSession();

                if (!isMounted) {
                    return;
                }

                if (result.isValid) {
                    setUser(result.user);
                    setProfile(result.profile);
                    setSession(result.session);
                } else {
                    applyUnauthenticatedState(result.reason);
                }
            } catch (error) {
                logger.error('AuthProvider.session.syncFailed', error);
                if (isMounted) {
                    applyUnauthenticatedState('Failed to validate session');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        hydrateFromSession();

        const {
            data: { subscription },
        } = authService.onAuthStateChange(async (event, nextSession) => {
            if (!isMounted) {
                return;
            }

            logger.info('AuthProvider.authStateChange', { event });
            setIsLoading(true);

            if (nextSession?.user) {
                try {
                    const nextProfile = await authService.getUserProfile(nextSession.user.id);

                    if (!isMounted) {
                        return;
                    }

                    if (nextProfile && ACCEPTED_ROLES.includes(nextProfile.role)) {
                        setUser(nextSession.user);
                        setSession(nextSession);
                        setProfile(nextProfile);
                    } else {
                        logger.warn('AuthProvider.authStateChange.invalidProfile', {
                            userId: nextSession.user.id,
                            hasProfile: Boolean(nextProfile),
                            role: nextProfile?.role,
                        });
                        await authService.signOut();
                        if (isMounted) {
                            applyUnauthenticatedState('Invalid profile');
                        }
                    }
                } catch (error) {
                    logger.error('AuthProvider.authStateChange.profileFetchFailed', error);
                    if (isMounted) {
                        applyUnauthenticatedState('Failed to load profile');
                    }
                }
            } else {
                applyUnauthenticatedState('Session ended');
            }

            if (isMounted) {
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.signOut();
        } catch (error) {
            logger.error('AuthProvider.signOut.failed', error);
        } finally {
            setUser(null);
            setProfile(null);
            setSession(null);
            setIsLoading(false);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        if (!user) {
            return;
        }

        try {
            const nextProfile = await authService.getUserProfile(user.id);
            setProfile(nextProfile);
        } catch (error) {
            logger.error('AuthProvider.refreshProfile.failed', error);
        }
    }, [user]);

    const roleFlags = useMemo(
        () => ({
            isAdmin: isAdminRole(profile),
            isSuperAdmin: isSuperAdminRole(profile),
        }),
        [profile],
    );

    const value = useMemo(
        () => ({
            user,
            profile,
            session,
            isLoading,
            isAdmin: roleFlags.isAdmin,
            isSuperAdmin: roleFlags.isSuperAdmin,
            signOut: handleSignOut,
            refreshProfile,
        }),
        [
            user,
            profile,
            session,
            isLoading,
            roleFlags.isAdmin,
            roleFlags.isSuperAdmin,
            handleSignOut,
            refreshProfile,
        ],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
