import React, { useState, useEffect, useCallback } from 'react';
import { signInWithGoogle, signOut, onAuthChange, User } from '../lib/firebase';
import { LogIn, LogOut, UserCircle } from 'lucide-react';

/**
 * GoogleSignIn component provides Firebase Authentication with Google Sign-In.
 * Displays a sign-in button or user avatar based on authentication state.
 * Uses Firebase's GoogleAuthProvider for secure OAuth 2.0 authentication.
 */
export const GoogleSignIn: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, []);

  if (user) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
        }}
        role="status"
        aria-label={`Signed in as ${user.displayName || user.email}`}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '2px solid var(--color-primary)',
            }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <UserCircle size={28} color="var(--color-primary)" aria-hidden="true" />
        )}
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            maxWidth: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user.displayName?.split(' ')[0] || 'User'}
        </span>
        <button
          onClick={handleSignOut}
          aria-label="Sign out"
          title="Sign out"
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'var(--transition-fast)',
          }}
        >
          <LogOut size={12} aria-hidden="true" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      aria-label="Sign in with Google"
      title="Sign in with Google for a personalized experience"
      style={{
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--color-primary)',
        cursor: isLoading ? 'wait' : 'pointer',
        padding: '6px 12px',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'var(--transition-fast)',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      <LogIn size={14} aria-hidden="true" />
      {isLoading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
};
