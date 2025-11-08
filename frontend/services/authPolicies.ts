/**
 * Lightweight role helpers so consumers do not need to re-encode access logic.
 */

import type { UserProfile, UserRole } from './authService';

type RoleCarrier = Pick<UserProfile, 'role'> | null | undefined;

export const VALID_ROLES: ReadonlyArray<UserRole> = ['user', 'admin', 'superadmin'];
export const ADMIN_ROLES: ReadonlyArray<UserRole> = ['admin', 'superadmin'];

export const hasRecognizedRole = (profile: RoleCarrier): profile is Pick<UserProfile, 'role'> => {
  return Boolean(profile && VALID_ROLES.includes(profile.role));
};

export const isAdminRole = (profile: RoleCarrier): boolean => {
  return hasRecognizedRole(profile) && ADMIN_ROLES.includes(profile.role);
};

export const isSuperAdminRole = (profile: RoleCarrier): boolean => {
  return profile?.role === 'superadmin';
};
