import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, signup, logout } from '@/app/actions/auth';

const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
    },
  })),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    set: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  }),
}));

vi.mock('@/app/actions/vapi', () => ({
  provisionUserVapiAssistant: vi.fn().mockResolvedValue({ vapiAssistantId: 'vapi-ast-mock-123' }),
}));

describe('src/app/actions/auth.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects empty login credentials with error', async () => {
    const formData = new FormData();
    const res = await login(formData);
    expect(res.error).toBe('Please enter your email and password.');
  });

  it('logs in successfully with valid credentials', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: { access_token: 'mock_jwt_token' } },
      error: null,
    });

    const formData = new FormData();
    formData.append('email', 'richmond@heyamira.com');
    formData.append('password', 'SecretPass123!');

    const res = await login(formData);
    expect(res.success).toBe(true);
  });

  it('signs up a new user and provisions dedicated Vapi assistant', async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { user: { id: 'usr-new-123', email: 'emeka@gmail.com' } },
      error: null,
    });

    const formData = new FormData();
    formData.append('email', 'emeka@gmail.com');
    formData.append('password', 'SecurePass123!');
    formData.append('firstName', 'Emeka');
    formData.append('lastName', 'Okafor');

    const res = await signup(formData);
    expect(res.success).toBe(true);
    expect(res.vapiAssistantId).toBe('vapi-ast-mock-123');
  });

  it('logs out and clears session cookies', async () => {
    mockSignOut.mockResolvedValueOnce({ error: null });
    const res = await logout();
    expect(res.success).toBe(true);
  });
});
