/**
 * Authentication Service
 * Handles all Supabase authentication operations
 */

import { supabase } from '../utils/supabase';
import { sessionCache } from '../utils/sessionCache';
import type { AuthError, User, Session } from '@supabase/supabase-js';

// =====================================================
// TYPES
// =====================================================

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    display_name: string | null;
    username: string | null;
    role: UserRole;
    avatar_url: string | null;
    date_of_birth: string | null;
    created_at: string;
    updated_at: string;
    last_sign_in_at: string | null;
    last_name_change_at: string | null;
}

export interface SignUpData {
    email: string;
    password: string;
    fullName?: string;
    dateOfBirth?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    profile?: UserProfile;
    session?: Session;
    error?: string;
}

// =====================================================
// ERROR HANDLING
// =====================================================

/**
 * Maps Supabase auth errors to user-friendly messages
 */
const mapAuthError = (error: AuthError): string => {
    switch (error.message) {
        case 'Invalid login credentials':
            return 'Invalid email or password. Please try again.';
        case 'Email not confirmed':
            return 'Please confirm your email address before signing in.';
        case 'User already registered':
            return 'An account with this email already exists.';
        case 'Password should be at least 6 characters':
            return 'Password must be at least 6 characters long.';
        case 'Unable to validate email address: invalid format':
            return 'Please enter a valid email address.';
        case 'Email rate limit exceeded':
            return 'Too many requests. Please try again later.';
        default:
            // Check for duplicate email error patterns
            if (error.message?.toLowerCase().includes('already registered') || 
                error.message?.toLowerCase().includes('already exists') ||
                error.message?.toLowerCase().includes('duplicate')) {
                return 'An account with this email already exists.';
            }
            return error.message || 'An error occurred. Please try again.';
    }
};

// =====================================================
// AUTHENTICATION METHODS
// =====================================================

/**
 * Sign up a new user with email and password
 */
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    try {
        const { email, password, fullName, dateOfBirth } = data;

        console.log('🔄 Starting signup process for:', email);

        // Sign up with Supabase Auth
        // Supabase will prevent duplicate signups automatically
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || '',
                    date_of_birth: dateOfBirth || null,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (authError) {
            console.error('❌ Auth signup error:', authError);
            return {
                success: false,
                error: mapAuthError(authError),
            };
        }

        if (!authData.user) {
            console.error('❌ No user returned from signup');
            return {
                success: false,
                error: 'Failed to create user account.',
            };
        }

        console.log('✅ Auth response received. User ID:', authData.user.id);
        console.log('📊 Session exists:', !!authData.session);
        console.log('📊 Identities count:', authData.user.identities?.length || 0);

        // CRITICAL: When email confirmation is disabled, Supabase's behavior:
        // - New user: Returns user + session + identities array with data
        // - Existing user: Returns user WITHOUT session + empty/no identities array
        // This is the ONLY way to detect duplicate signups when confirmation is disabled
        
        if (!authData.session) {
            console.log('⚠️ No session returned - this indicates existing user');
            console.log('❌ Signup blocked - email already exists');
            return {
                success: false,
                error: 'An account with this email already exists. Please sign in instead.',
            };
        }

        // Double-check with identities array
        if (!authData.user.identities || authData.user.identities.length === 0) {
            console.log('⚠️ No identities array - this indicates existing user');
            console.log('❌ Signup blocked - email already exists');
            return {
                success: false,
                error: 'An account with this email already exists. Please sign in instead.',
            };
        }

        // Fetch the newly created profile
        const profile = await getUserProfile(authData.user.id);

        // If no profile was created, this is a problem
        if (!profile && authData.user) {
            console.error('⚠️ User created in auth but profile not found in database');
            // Still return success since auth account was created
            // The profile should be created by the database trigger
        }

        // Cache the session if profile exists
        if (profile) {
            sessionCache.saveSessionCache(profile);
        }

        console.log('✅ Signup complete for:', email);
        return {
            success: true,
            user: authData.user,
            session: authData.session || undefined,
            profile: profile || undefined,
        };
    } catch (error) {
        console.error('❌ Unexpected signup error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred during sign up.',
        };
    }
};

/**
 * Sign in with email and password
 * Validates user exists in database with proper role before allowing login
 */
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
    try {
        const { email, password } = data;

        // Step 1: Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return {
                success: false,
                error: mapAuthError(authError),
            };
        }

        if (!authData.user || !authData.session) {
            return {
                success: false,
                error: 'Failed to sign in.',
            };
        }

        // Step 2: Verify user profile exists in database
        const profile = await getUserProfile(authData.user.id);

        if (!profile) {
            // User authenticated but no profile in database
            console.error('User authenticated but profile not found in database');
            
            // Sign out the user since they don't have a valid profile
            await supabase.auth.signOut();
            
            return {
                success: false,
                error: 'Your account is not properly set up. Please contact support.',
            };
        }

        // Step 3: Validate user has a valid role (user, admin, or superadmin)
        if (!profile.role || !['user', 'admin', 'superadmin'].includes(profile.role)) {
            console.error('Invalid user role:', profile.role);
            
            // Sign out the user since they don't have a valid role
            await supabase.auth.signOut();
            
            return {
                success: false,
                error: 'Your account does not have proper permissions. Please contact support.',
            };
        }

        // Step 4: All checks passed - successful login
        console.log(`✅ User logged in successfully: ${profile.email} (${profile.role})`);

        // Cache the session for 24 hours
        sessionCache.saveSessionCache(profile);

        return {
            success: true,
            user: authData.user,
            session: authData.session || undefined,
            profile: profile,
        };
    } catch (error) {
        console.error('Sign in error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred during sign in.',
        };
    }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.auth.signOut();

        // Clear session cache on sign out
        sessionCache.clearSessionCache();

        if (error) {
            return {
                success: false,
                error: mapAuthError(error),
            };
        }

        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        // Still clear cache even if sign out fails
        sessionCache.clearSessionCache();
        return {
            success: false,
            error: 'An unexpected error occurred during sign out.',
        };
    }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};

/**
 * Get the current session
 */
export const getCurrentSession = async (): Promise<Session | null> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
};

// =====================================================
// USER PROFILE METHODS
// =====================================================

/**
 * Create user profile if it's missing (fallback for trigger failures)
 */
const createUserProfileIfMissing = async (userId: string): Promise<UserProfile | null> => {
    try {
        // Get user details from auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || user.id !== userId) {
            console.error('Cannot create profile: user mismatch or not authenticated');
            return null;
        }

        // Attempt to insert the profile
        const { data, error } = await supabase
            .from('user_profiles')
            .insert({
                id: userId,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || null,
                date_of_birth: user.user_metadata?.date_of_birth || null,
                role: 'user',
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to create missing user profile:', {
                code: error.code,
                message: error.message,
                details: error.details,
            });
            return null;
        }

        console.log('Successfully created missing user profile for:', userId);
        return data;
    } catch (error) {
        console.error('Unexpected error creating user profile:', error);
        return null;
    }
};

/**
 * Get user profile by user ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            // Log detailed error information
            console.error('Get user profile error:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint,
                userId: userId,
                fullError: error // Log the complete error object
            });
            
            // 500 error suggests database/schema issue
            if (error.message && error.message.includes('500')) {
                console.error('⚠️ Database error (500): This might indicate:');
                console.error('1. The user_profiles table does not exist');
                console.error('2. The user_role enum type is missing');
                console.error('3. Database migration has not been run');
                console.error('4. Database connection issue');
                console.error('👉 Please run the migration: supabase/migrations/20251021000000_create_user_profiles_and_rbac.sql');
                return null;
            }
            
            // If profile doesn't exist, try to create it
            if (error.code === 'PGRST116') {
                console.warn('User profile not found, attempting to create it...');
                return await createUserProfileIfMissing(userId);
            }
            
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error in getUserProfile:', error);
        return null;
    }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'email' | 'role' | 'created_at' | 'updated_at' | 'username' | 'display_name' | 'last_name_change_at'>>
): Promise<AuthResponse> => {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            return {
                success: false,
                error: 'Failed to update profile.',
            };
        }

        return {
            success: true,
            profile: data,
        };
    } catch (error) {
        console.error('Update profile error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while updating profile.',
        };
    }
};

/**
 * Update user display name (with 24-hour cooldown)
 */
export const updateDisplayName = async (newDisplayName: string): Promise<AuthResponse> => {
    try {
        const { data, error } = await supabase.rpc('update_user_display_name', {
            new_display_name: newDisplayName,
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to update display name.',
            };
        }

        // Parse the JSONB response
        const result = data as { success: boolean; error?: string; message?: string; next_change_at?: string };

        if (!result.success) {
            return {
                success: false,
                error: result.error || 'Failed to update display name.',
            };
        }

        // Refresh the profile
        const user = await getCurrentUser();
        if (user) {
            const profile = await getUserProfile(user.id);
            return {
                success: true,
                profile: profile || undefined,
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Update display name error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while updating display name.',
        };
    }
};

/**
 * Set username (one-time or admin-only change)
 */
export const setUsername = async (newUsername: string): Promise<AuthResponse> => {
    try {
        const { data, error } = await supabase.rpc('set_username', {
            new_username: newUsername,
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to set username.',
            };
        }

        // Parse the JSONB response
        const result = data as { success: boolean; error?: string; message?: string };

        if (!result.success) {
            return {
                success: false,
                error: result.error || 'Failed to set username.',
            };
        }

        // Refresh the profile
        const user = await getCurrentUser();
        if (user) {
            const profile = await getUserProfile(user.id);
            return {
                success: true,
                profile: profile || undefined,
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Set username error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while setting username.',
        };
    }
};

/**
 * Check if user is admin or superadmin
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
    try {
        const profile = await getUserProfile(userId);
        return profile?.role === 'admin' || profile?.role === 'superadmin';
    } catch (error) {
        console.error('Check admin error:', error);
        return false;
    }
};

/**
 * Check if user is superadmin
 */
export const isSuperAdmin = async (userId: string): Promise<boolean> => {
    try {
        const profile = await getUserProfile(userId);
        return profile?.role === 'superadmin';
    } catch (error) {
        console.error('Check superadmin error:', error);
        return false;
    }
};

/**
 * Get all user profiles (admin only)
 */
export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get all profiles error:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Get all profiles error:', error);
        return [];
    }
};

// =====================================================
// PASSWORD MANAGEMENT
// =====================================================

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            return {
                success: false,
                error: mapAuthError(error),
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Password reset error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while sending reset email.',
        };
    }
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return {
                success: false,
                error: mapAuthError(error),
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Update password error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while updating password.',
        };
    }
};

// =====================================================
// SESSION MANAGEMENT
// =====================================================

/**
 * Validate session integrity
 * Checks if the session is valid AND user profile exists in database
 */
export const validateSession = async (): Promise<{
    isValid: boolean;
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    reason?: string;
}> => {
    try {
        // Step 1: Get session from cookies
        const session = await getCurrentSession();
        
        if (!session?.user) {
            return {
                isValid: false,
                user: null,
                profile: null,
                session: null,
                reason: 'No active session found',
            };
        }

        // Step 2: Verify user profile exists in database
        const profile = await getUserProfile(session.user.id);

        if (!profile) {
            return {
                isValid: false,
                user: session.user,
                profile: null,
                session: session,
                reason: 'User profile not found in database',
            };
        }

        // Step 3: Validate role
        if (!profile.role || !['user', 'admin', 'superadmin'].includes(profile.role)) {
            return {
                isValid: false,
                user: session.user,
                profile: profile,
                session: session,
                reason: `Invalid user role: ${profile.role}`,
            };
        }

        // All checks passed
        return {
            isValid: true,
            user: session.user,
            profile: profile,
            session: session,
        };
    } catch (error) {
        console.error('Error validating session:', error);
        return {
            isValid: false,
            user: null,
            profile: null,
            session: null,
            reason: 'Error validating session',
        };
    }
};

/**
 * Refresh the current session
 */
export const refreshSession = async (): Promise<Session | null> => {
    try {
        const { data: { session }, error } = await supabase.auth.refreshSession();

        if (error) {
            console.error('Refresh session error:', error);
            return null;
        }

        return session;
    } catch (error) {
        console.error('Refresh session error:', error);
        return null;
    }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (
    callback: (event: string, session: Session | null) => void
) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
};

// =====================================================
// ADMIN FUNCTIONS
// =====================================================

/**
 * Promote user to admin (superadmin only)
 */
export const promoteToAdmin = async (userId: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.rpc('promote_to_admin', {
            target_user_id: userId,
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to promote user to admin.',
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Promote to admin error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while promoting user.',
        };
    }
};

/**
 * Demote admin to user (superadmin only)
 */
export const demoteToUser = async (userId: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.rpc('demote_to_user', {
            target_user_id: userId,
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to demote user.',
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Demote to user error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while demoting user.',
        };
    }
};

/**
 * Promote admin to superadmin (superadmin only)
 */
export const promoteToSuperAdmin = async (userId: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.rpc('promote_to_superadmin', {
            target_user_id: userId,
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to promote user to superadmin.',
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Promote to superadmin error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while promoting user.',
        };
    }
};

/**
 * Demote superadmin to admin (superadmin only)
 */
export const demoteSuperAdminToAdmin = async (userId: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.rpc('demote_superadmin_to_admin', {
            target_user_id: userId,
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to demote superadmin.',
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Demote superadmin error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while demoting superadmin.',
        };
    }
};

/**
 * Delete user account (superadmin only)
 */
export const deleteUser = async (userId: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.rpc('delete_user', {
            target_user_id: userId,
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to delete user.',
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error('Delete user error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred while deleting user.',
        };
    }
};

// =====================================================
// EXPORTS
// =====================================================

export const authService = {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    getCurrentSession,
    validateSession,
    getUserProfile,
    updateUserProfile,
    updateDisplayName,
    setUsername,
    isAdmin,
    isSuperAdmin,
    getAllUserProfiles,
    sendPasswordResetEmail,
    updatePassword,
    refreshSession,
    onAuthStateChange,
    promoteToAdmin,
    demoteToUser,
    promoteToSuperAdmin,
    demoteSuperAdminToAdmin,
    deleteUser,
};

export default authService;
