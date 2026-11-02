import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, user, signOut } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickSignIn = async (email: string, name: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // Smooth auth simulation
    await signInWithGoogle(email, name);
    setLoading(false);
    onClose();
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    await signInWithGoogle(customEmail, customEmail.split('@')[0]);
    setLoading(false);
    onClose();
  };

  return (
    <div className="google-auth-backdrop" onClick={onClose}>
      <div className="google-auth-card" onClick={(e) => e.stopPropagation()}>
        {/* Google Header */}
        <div className="google-header">
          <svg className="google-icon" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <h3>Sign in with Google</h3>
          <p>Choose an account to access KXTXR Signal & Control Plane</p>
        </div>

        {user ? (
          <div className="current-user-box">
            <div className="avatar-disc">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <span className="role-tag">ROLE: {user.role}</span>
            </div>
            <button
              type="button"
              className="google-signout-btn"
              onClick={() => {
                signOut();
                onClose();
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="account-list">
            {/* Preferred Account: kxtxr@systemfriction.org */}
            <button
              type="button"
              className="account-option priority"
              disabled={loading}
              onClick={() =>
                handleQuickSignIn(
                  'kxtxr@systemfriction.org',
                  'Edwing · KXTXR Canonical Operator'
                )
              }
            >
              <div className="account-avatar edwing-avatar">E</div>
              <div className="account-details">
                <div className="account-name">
                  Edwing <span className="verified-badge">✓ CANONICAL</span>
                </div>
                <div className="account-email">kxtxr@systemfriction.org</div>
                <div className="account-scope">
                  System Friction Institute · Full Operator Authority
                </div>
              </div>
            </button>

            <div className="auth-separator">
              <span>or sign in with another Google account</span>
            </div>

            <form onSubmit={handleCustomSubmit} className="custom-email-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="google-action-btn"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Next'}
              </button>
            </form>
          </div>
        )}

        <div className="google-footer">
          <span>
            To continue, Google will share your name, email address, language preference, and profile picture with KXTXR.
          </span>
          <div className="auth-footer-links">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
