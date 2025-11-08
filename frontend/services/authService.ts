import { supabase } from '../utils/supabase';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

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

const normalizeAuthError = (error: AuthError): string => {
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
      if (error.message?.toLowerCase().includes('already registered') ||
          error.message?.toLowerCase().includes('already exists') ||
          error.message?.toLowerCase().includes('duplicate')) {
        return 'An account with this email already exists.';
      }
      return error.message || 'An error occurred. Please try again.';
  }
};

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const { email, password, fullName, dateOfBirth } = data;

  try {
    logger.info('authService.signUp.start', { email });

    const redirectTo =
      typeof window === 'undefined' ? undefined : `${window.location.origin}/auth/callback`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
          date_of_birth: dateOfBirth || null,
        },
        emailRedirectTo: redirectTo,
      },
    });

    if (authError) {
      logger.warn('authService.signUp.supabaseError', {
        code: authError.code,
        message: authError.message,
      });
      return {
        success: false,
        error: normalizeAuthError(authError),
      };
    }

    if (!authData.user) {
      logger.error('authService.signUp.missingUser', { email });
      return {
        success: false,
        error: 'Failed to create user account.',
      };
    }

    if (!authData.session) {
      logger.warn('authService.signUp.sessionMissingIndicatesExistingUser', { email });
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    if (!authData.user.identities || authData.user.identities.length === 0) {
      logger.warn('authService.signUp.identitiesMissingIndicatesExistingUser', { email });
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    const profile = await getUserProfile(authData.user.id);

    if (!profile) {
      logger.warn('authService.signUp.profileMissingPostCreation', {
        userId: authData.user.id,
      });
    }

    logger.info('authService.signUp.success', { email });

    return {
      success: true,
      user: authData.user,
      session: authData.session ?? undefined,
      profile: profile ?? undefined,
    };
  } catch (error) {
    logger.error('authService.signUp.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign up.',
    };
  }
};

export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  const { email, password } = data;

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      logger.warn('authService.signIn.supabaseError', {
        code: authError.code,
        message: authError.message,
      });
      return {
        success: false,
        error: normalizeAuthError(authError),
      };
    }

    if (!authData.user || !authData.session) {
      logger.error('authService.signIn.missingAuthResponse', { email });
      return {
        success: false,
        error: 'Failed to sign in.',
      };
    }

    const profile = await getUserProfile(authData.user.id);

    if (!profile) {
      logger.warn('authService.signIn.profileMissing', { userId: authData.user.id });
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Your account is not properly set up. Please contact support.',
      };
    }

    if (!['user', 'admin', 'superadmin'].includes(profile.role)) {
      logger.warn('authService.signIn.invalidRole', {
        userId: authData.user.id,
        role: profile.role,
      });
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Your account does not have proper permissions. Please contact support.',
      };
    }

    logger.info('authService.signIn.success', { email, role: profile.role });

    return {
      success: true,
      user: authData.user,
      session: authData.session,
      profile,
    };
  } catch (error) {
    logger.error('authService.signIn.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign in.',
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.warn('authService.signOut.supabaseError', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: normalizeAuthError(error),
      };
    }

    logger.info('authService.signOut.success');
    return { success: true };
  } catch (error) {
    logger.error('authService.signOut.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign out.',
    };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    logger.error('authService.getCurrentUser.error', error);
    return null;
  }
};

export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    logger.error('authService.getCurrentSession.error', error);
    return null;
  }
};

const createUserProfileIfMissing = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user || authData.user.id !== userId) {
      logger.warn('authService.createUserProfileIfMissing.userMismatch', { userId });
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: authData.user.email || '',
        full_name: authData.user.user_metadata?.full_name || null,
        date_of_birth: authData.user.user_metadata?.date_of_birth || null,
        role: 'user',
      })
      .select()
      .single();

    if (error) {
      logger.error('authService.createUserProfileIfMissing.insertError', {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      return null;
    }

    logger.info('authService.createUserProfileIfMissing.success', { userId });
    return data;
  } catch (error) {
    logger.error('authService.createUserProfileIfMissing.unexpectedError', error);
    return null;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      logger.error('authService.getUserProfile.error', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userId,
      });

      if (error.code === 'PGRST116') {
        logger.warn('authService.getUserProfile.missingProfile', { userId });
        return await createUserProfileIfMissing(userId);
      }

      return null;
    }

    return data;
  } catch (error) {
    logger.error('authService.getUserProfile.unexpectedError', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<
    Omit<
      UserProfile,
      'id' | 'email' | 'role' | 'created_at' | 'updated_at' | 'username' | 'display_name' | 'last_name_change_at'
    >
  >
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('authService.updateUserProfile.error', {
        code: error.code,
        message: error.message,
      });
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
    logger.error('authService.updateUserProfile.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating profile.',
    };
  }
};

export const updateDisplayName = async (newDisplayName: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.rpc('update_user_display_name', {
      new_display_name: newDisplayName,
    });

    if (error) {
      logger.error('authService.updateDisplayName.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.message || 'Failed to update display name.',
      };
    }

    const result = data as {
      success: boolean;
      error?: string;
      message?: string;
      next_change_at?: string;
    };

    if (!result.success) {
      logger.warn('authService.updateDisplayName.failure', result);
      return {
        success: false,
        error: result.error || 'Failed to update display name.',
      };
    }

    const user = await getCurrentUser();
    if (user) {
      const profile = await getUserProfile(user.id);
      return {
        success: true,
        profile: profile ?? undefined,
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.updateDisplayName.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating display name.',
    };
  }
};

export const setUsername = async (newUsername: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.rpc('set_username', {
      new_username: newUsername,
    });

    if (error) {
      logger.error('authService.setUsername.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.message || 'Failed to set username.',
      };
    }

    const result = data as { success: boolean; error?: string; message?: string };

    if (!result.success) {
      logger.warn('authService.setUsername.failure', result);
      return {
        success: false,
        error: result.error || 'Failed to set username.',
      };
    }

    const user = await getCurrentUser();
    if (user) {
      const profile = await getUserProfile(user.id);
      return {
        success: true,
        profile: profile ?? undefined,
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.setUsername.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while setting username.',
    };
  }
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(userId);
    return profile?.role === 'admin' || profile?.role === 'superadmin';
  } catch (error) {
    logger.error('authService.isAdmin.error', error);
    return false;
  }
};

export const isSuperAdmin = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(userId);
    return profile?.role === 'superadmin';
  } catch (error) {
    logger.error('authService.isSuperAdmin.error', error);
    return false;
  }
};

export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('authService.getAllUserProfiles.error', {
        code: error.code,
        message: error.message,
      });
      return [];
    }

    return data ?? [];
  } catch (error) {
    logger.error('authService.getAllUserProfiles.unexpectedError', error);
    return [];
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window === 'undefined'
          ? undefined
          : `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      logger.error('authService.sendPasswordResetEmail.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: normalizeAuthError(error),
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.sendPasswordResetEmail.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while sending reset email.',
    };
  }
};

export const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      logger.error('authService.updatePassword.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: normalizeAuthError(error),
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.updatePassword.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating password.',
    };
  }
};

export const validateSession = async (): Promise<{
  isValid: boolean;
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  reason?: string;
}> => {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      logger.info('authService.validateSession.noActiveSession');
      return {
        isValid: false,
        user: null,
        profile: null,
        session: null,
        reason: 'No active session found',
      };
    }

    const profile = await getUserProfile(session.user.id);

    if (!profile) {
      logger.warn('authService.validateSession.profileMissing', {
        userId: session.user.id,
      });
      return {
        isValid: false,
        user: session.user,
        profile: null,
        session,
        reason: 'User profile not found in database',
      };
    }

    if (!['user', 'admin', 'superadmin'].includes(profile.role)) {
      logger.warn('authService.validateSession.invalidRole', {
        userId: session.user.id,
        role: profile.role,
      });
      return {
        isValid: false,
        user: session.user,
        profile,
        session,
        reason: `Invalid user role: ${profile.role}`,
      };
    }

    return {
      isValid: true,
      user: session.user,
      profile,
      session,
    };
  } catch (error) {
    logger.error('authService.validateSession.unexpectedError', error);
    return {
      isValid: false,
      user: null,
      profile: null,
      session: null,
      reason: 'Error validating session',
    };
  }
};

export const refreshSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      logger.error('authService.refreshSession.error', {
        code: error.code,
        message: error.message,
      });
      return null;
    }

    return data.session;
  } catch (error) {
    logger.error('authService.refreshSession.unexpectedError', error);
    return null;
  }
};

export const onAuthStateChange = (
  callback: (event: string, session: Session | null) => void,
) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

export const promoteToAdmin = async (userId: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.rpc('promote_to_admin', {
      target_user_id: userId,
    });

    if (error) {
      logger.error('authService.promoteToAdmin.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.message || 'Failed to promote user to admin.',
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.promoteToAdmin.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while promoting user.',
    };
  }
};

export const demoteToUser = async (userId: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.rpc('demote_to_user', {
      target_user_id: userId,
    });

    if (error) {
      logger.error('authService.demoteToUser.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.message || 'Failed to demote user.',
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.demoteToUser.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while demoting user.',
    };
  }
};

export const promoteToSuperAdmin = async (userId: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.rpc('promote_to_superadmin', {
      target_user_id: userId,
    });

    if (error) {
      logger.error('authService.promoteToSuperAdmin.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.message || 'Failed to promote user to superadmin.',
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.promoteToSuperAdmin.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while promoting user.',
    };
  }
};

export const demoteSuperAdminToAdmin = async (userId: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.rpc('demote_superadmin_to_admin', {
      target_user_id: userId,
    });

    if (error) {
      logger.error('authService.demoteSuperAdminToAdmin.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.message || 'Failed to demote superadmin.',
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.demoteSuperAdminToAdmin.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while demoting superadmin.',
    };
  }
};

export const deleteUser = async (userId: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.rpc('delete_user', {
      target_user_id: userId,
    });

    if (error) {
      logger.error('authService.deleteUser.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.message || 'Failed to delete user.',
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('authService.deleteUser.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while deleting user.',
    };
  }
};

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
