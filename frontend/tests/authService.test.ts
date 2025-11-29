import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authService, type UserProfile } from '@/services/authService';

type SupabaseAuthResponse<T> = {
  data: T;
  error: null | { code?: string; message: string; details?: string };
};

type SupabaseProfileResponse = SupabaseAuthResponse<UserProfile | null>;

const createUserProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: 'user-123',
  email: 'user@example.com',
  username: 'test_user',
  display_name: 'tester',
  role: 'user',
  avatar_url: null,
  date_of_birth: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  last_name_change_at: null,
  ...overrides,
});

const supabaseMock: any = vi.hoisted(() => ({ auth: {}, from: vi.fn() }));

vi.mock('@/utils/supabase', () => ({
  supabase: supabaseMock,
}));

describe('authService integration flow', () => {
  let profileResponse: SupabaseProfileResponse;

  beforeEach(() => {
    profileResponse = {
      data: createUserProfile(),
      error: null,
    };

    supabaseMock.auth = {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    };

    supabaseMock.from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => Promise.resolve(profileResponse)),
      insert: vi.fn().mockReturnThis(),
    }));
  });

  it('signUp returns user, session, and profile when Supabase succeeds', async () => {
    const session = { access_token: 'token', user: { id: 'user-123' } } as any;
    const user = { id: 'user-123', email: 'user@example.com', identities: [{}] } as any;

    supabaseMock.auth.signUp.mockResolvedValue({
      data: { user, session },
      error: null,
    });

    const result = await authService.signUp({ email: 'user@example.com', password: 'secret' });

    expect(result.success).toBe(true);
    expect(result.user).toEqual(user);
    expect(result.session).toEqual(session);
    expect(result.profile).toEqual(profileResponse.data);
  });

  it('signUp fails gracefully when Supabase indicates duplicate email', async () => {
    const user = { id: 'user-123', email: 'user@example.com', identities: [] } as any;

    supabaseMock.auth.signUp.mockResolvedValue({
      data: { user, session: null },
      error: null,
    });

    const result = await authService.signUp({ email: 'user@example.com', password: 'secret' });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  it('signIn returns profile when credentials and profile are valid', async () => {
    const session = { access_token: 'token', user: { id: 'user-123' } } as any;
    const user = { id: 'user-123', email: 'user@example.com' } as any;

    supabaseMock.auth.signInWithPassword.mockResolvedValue({
      data: { user, session },
      error: null,
    });

    const result = await authService.signIn({ email: 'user@example.com', password: 'secret' });

    expect(result.success).toBe(true);
    expect(result.profile).toEqual(profileResponse.data);
  });

  it('signIn signs out and fails when profile is missing', async () => {
    const session = { access_token: 'token', user: { id: 'user-123' } } as any;
    const user = { id: 'user-123', email: 'user@example.com' } as any;

    supabaseMock.auth.signInWithPassword.mockResolvedValue({
      data: { user, session },
      error: null,
    });

    profileResponse = { data: null, error: null };

    const result = await authService.signIn({ email: 'user@example.com', password: 'secret' });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not properly set up/i);
    expect(supabaseMock.auth.signOut).toHaveBeenCalled();
  });
});
