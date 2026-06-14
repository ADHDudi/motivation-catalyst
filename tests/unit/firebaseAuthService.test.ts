// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firebaseAuthService } from '../../services/firebaseAdapters';

const mockUser = { uid: 'u1', displayName: 'Test User', email: 'test@example.com' };

function makeAuthInstance(overrides: Record<string, any> = {}) {
  return {
    signInWithPopup: vi.fn().mockResolvedValue({ user: mockUser }),
    signInWithRedirect: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
    onAuthStateChanged: vi.fn().mockReturnValue(() => {}),
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: mockUser }),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: mockUser }),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeFirebaseMock(authInstance = makeAuthInstance()) {
  function GoogleAuthProvider() {}
  const authFn = Object.assign(() => authInstance, { GoogleAuthProvider });
  return { apps: [{}], auth: authFn };
}

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.stubGlobal('firebase', makeFirebaseMock());
});

// ─── signInWithGoogle ─────────────────────────────────────────────────────────

describe('signInWithGoogle', () => {
  it('returns user from signInWithPopup on desktop', async () => {
    const user = await firebaseAuthService.signInWithGoogle();
    expect(user).toBe(mockUser);
  });

  it('propagates non-dismissed errors', async () => {
    const err = Object.assign(new Error('network'), { code: 'auth/network-request-failed' });
    vi.stubGlobal('firebase', makeFirebaseMock(makeAuthInstance({ signInWithPopup: vi.fn().mockRejectedValue(err) })));
    await expect(firebaseAuthService.signInWithGoogle()).rejects.toThrow('network');
  });

  it('returns null when Firebase not ready', async () => {
    vi.stubGlobal('firebase', { apps: [] });
    const user = await firebaseAuthService.signInWithGoogle();
    expect(user).toBeNull();
  });
});

// ─── signOutUser ──────────────────────────────────────────────────────────────

describe('signOutUser', () => {
  it('calls signOut on Firebase auth', async () => {
    const authInstance = makeAuthInstance();
    vi.stubGlobal('firebase', makeFirebaseMock(authInstance));
    await firebaseAuthService.signOutUser();
    expect(authInstance.signOut).toHaveBeenCalled();
  });

  it('does not throw when Firebase not ready', async () => {
    vi.stubGlobal('firebase', { apps: [] });
    await expect(firebaseAuthService.signOutUser()).resolves.toBeUndefined();
  });
});

// ─── onAuthStateChange ────────────────────────────────────────────────────────

describe('onAuthStateChange', () => {
  it('registers callback with onAuthStateChanged and returns unsubscribe', () => {
    const authInstance = makeAuthInstance();
    vi.stubGlobal('firebase', makeFirebaseMock(authInstance));
    const cb = vi.fn();
    const unsubscribe = firebaseAuthService.onAuthStateChange(cb);
    expect(authInstance.onAuthStateChanged).toHaveBeenCalledWith(cb);
    expect(typeof unsubscribe).toBe('function');
  });

  it('returns a no-op unsubscribe when Firebase not ready', () => {
    vi.stubGlobal('firebase', { apps: [] });
    const unsubscribe = firebaseAuthService.onAuthStateChange(vi.fn());
    expect(() => unsubscribe()).not.toThrow();
  });
});

// ─── signInWithEmail ──────────────────────────────────────────────────────────

describe('signInWithEmail', () => {
  it('returns user from signInWithEmailAndPassword', async () => {
    const user = await firebaseAuthService.signInWithEmail('a@b.com', 'pass');
    expect(user).toBe(mockUser);
  });

  it('rethrows Firebase errors', async () => {
    const err = Object.assign(new Error('wrong-password'), { code: 'auth/wrong-password' });
    vi.stubGlobal('firebase', makeFirebaseMock(makeAuthInstance({ signInWithEmailAndPassword: vi.fn().mockRejectedValue(err) })));
    await expect(firebaseAuthService.signInWithEmail('a@b.com', 'bad')).rejects.toThrow('wrong-password');
  });
});

// ─── signUpWithEmail ──────────────────────────────────────────────────────────

describe('signUpWithEmail', () => {
  it('returns user from createUserWithEmailAndPassword', async () => {
    const user = await firebaseAuthService.signUpWithEmail('a@b.com', 'pass');
    expect(user).toBe(mockUser);
  });
});

// ─── sendPasswordReset ────────────────────────────────────────────────────────

describe('sendPasswordReset', () => {
  it('resolves on success', async () => {
    await expect(firebaseAuthService.sendPasswordReset('a@b.com')).resolves.toBeUndefined();
  });

  it('rethrows when email not registered', async () => {
    const err = Object.assign(new Error('user-not-found'), { code: 'auth/user-not-found' });
    vi.stubGlobal('firebase', makeFirebaseMock(makeAuthInstance({ sendPasswordResetEmail: vi.fn().mockRejectedValue(err) })));
    await expect(firebaseAuthService.sendPasswordReset('x@y.com')).rejects.toThrow('user-not-found');
  });
});
